const si = require('systeminformation');
const fs = require('fs');
const path = require('path');
const os = require('os');

class OptimiserService {
  constructor() {
  }

  // ====================================
  // Exécuter les commandes d'optimisation en fonction de l'OS
  // ====================================
  async executeCommande(os, commandes, sudoPassword = null, onProgress = null) {
  if (!commandes || commandes.length === 0) {
    console.warn('Aucune commande à exécuter');
    return [];
  }

  const shell = os === 'win32' ? 'powershell.exe' : '/bin/bash';
  const totalCommandes = commandes.length;
  let completedCommandes = 0;
  let successCount = 0;
  let failedCount = 0;
  let skippedCount = 0;
  const startTime = Date.now();

  if (sudoPassword) {
    console.log('Exécution avec privilèges sudo - Mode FULL PARALLÈLE (48 commandes simultanées)');
  }

  const updateProgress = (cmd, success, error = null) => {
    completedCommandes++;
    const percentage = Math.round((completedCommandes / totalCommandes) * 100);
    const elapsedTime = (Date.now() - startTime) / 1000;
    const avgTime = elapsedTime / completedCommandes;
    const estimatedTimeLeft = Math.round(avgTime * (totalCommandes - completedCommandes));
    
    if (success) {
      successCount++;
      console.log(`✓ [${completedCommandes}/${totalCommandes}] ${percentage}% - ${cmd.description || cmd.commande}`);
    } else {
      const errorMessage = typeof error === 'string' ? error : (error?.message || '');
      const isNonCritical = errorMessage && (
        errorMessage.includes('Operation not permitted') ||
        errorMessage.includes('Permission denied') ||
        errorMessage.includes('command not found') ||
        errorMessage.includes('No such file') ||
        errorMessage.includes('not installed') ||
        errorMessage.includes('Running Homebrew as root')
      );
      
      if (isNonCritical) {
        skippedCount++;
        console.log(`⚠️  [${completedCommandes}/${totalCommandes}] ${percentage}% - ${cmd.description || cmd.commande} (ignoré)`);
      } else {
        failedCount++;
        console.error(`✗ [${completedCommandes}/${totalCommandes}] ${percentage}% - ${cmd.description || cmd.commande}`);
      }
    }
    
    if (onProgress) {
      onProgress({
        current: completedCommandes,
        total: totalCommandes,
        percentage,
        commandeName: cmd.description || cmd.commande,
        success,
        successCount,
        failedCount,
        skippedCount,
        estimatedTimeLeft
      });
    }
  };

  const promises = commandes.map(async (cmd) => {
    try {
      const output = await this.execCommandAsync(shell, cmd.commande, sudoPassword);
      const result = { 
        id: cmd.id,
        commande: cmd.commande, 
        description: cmd.description,
        os: cmd.os,
        output: output.substring(0, 500),
        success: true 
      };
      updateProgress(cmd, true);
      return result;
    } catch (error) {
      const errorMessage = error.message || error.toString();
      const isNonCritical = 
        errorMessage.includes('Operation not permitted') ||
        errorMessage.includes('Permission denied') ||
        errorMessage.includes('command not found') ||
        errorMessage.includes('No such file') ||
        errorMessage.includes('not installed') ||
        errorMessage.includes('Running Homebrew as root');
      
      const result = { 
        id: cmd.id,
        commande: cmd.commande,
        description: cmd.description,
        os: cmd.os,
        error: errorMessage.substring(0, 500),
        success: false,
        isNonCritical
      };
      updateProgress(cmd, false, errorMessage);
      return result;
    }
  });

  const results = await Promise.all(promises);

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(` Terminé en ${totalTime}s: ${successCount} réussies, ${skippedCount} ignorées, ${failedCount} échouées sur ${totalCommandes}`);
  
  return results;
}

execCommandAsync(shell, cmd, sudoPassword = null) {
  return new Promise((resolve, reject) => {
    // Sécurisation : échapper les caractères spéciaux du mot de passe
    if (sudoPassword && shell !== 'powershell.exe') {
      const { spawn } = require('child_process');
      const process = spawn('sudo', ['-S', 'sh', '-c', cmd], { shell: false });
      
      // Envoyer le mot de passe via stdin
      process.stdin.write(sudoPassword + '\n');
      process.stdin.end();

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', data => stdout += data.toString());
      process.stderr.on('data', data => stderr += data.toString());

      process.on('close', code => {
        if (code !== 0) {
          return reject(new Error(`Code de sortie ${code}: ${stderr}`));
        }
        resolve(stdout || stderr);
      });

      process.on('error', err => reject(err));
    } else {
      // Exécution standard sans sudo
      const { exec } = require('child_process');
      exec(cmd, { shell, timeout: 30000 }, (error, stdout, stderr) => {
        if (error) return reject(error);
        resolve(stdout || stderr);
      });
    }
  });
}


// Fonction pour calculer la taille d'un dossier récursivement
getFolderSize(dir) {
  let total = 0;
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        total += getFolderSize(fullPath);
      } else {
        total += stat.size;
      }
    }
  } catch (err) {
    // ignore erreurs (ex : accès refusé)
  }
  return total;
}

// Fonction pour récupérer les dossiers à scanner selon l'OS
getPlatformDirs() {
  const home = os.homedir();
  const platform = os.platform();

  if (platform === 'win32') {
    // Windows
    const root = path.parse(home).root; 
    return {
      tempDir: os.tmpdir(),
      userTempDir: path.join(home, 'AppData', 'Local', 'Temp'),
      cacheDir: path.join(home, 'AppData', 'Local'),
      recycleDir: path.join(root, '$Recycle.Bin'),
      userDir: home
    };
  } else if (platform === 'darwin') {
    // macOS
    return {
      tempDir: '/tmp',
      userTempDir: path.join(home, 'Library', 'Caches'),
      cacheDir: path.join(home, 'Library', 'Caches'),
      recycleDir: path.join(home, '.Trash'),
      userDir: home
    };
  } else {
    // Linux
    return {
      tempDir: '/tmp',
      userTempDir: path.join(home, '.cache'),
      cacheDir: path.join(home, '.cache'),
      recycleDir: path.join(home, '.local', 'share', 'Trash'),
      userDir: home
    };
  }
}

async getDiskAnalysis() {
  const disks = await si.fsSize();
  const dirs = getPlatformDirs();

  return disks.map(disk => {
    return {
      fs: disk.fs,
      mount: disk.mount,
      sizeGB: (disk.size / 1024 / 1024 / 1024).toFixed(2),
      tempGB: (this.getFolderSize(dirs.tempDir) / 1024 / 1024 / 1024).toFixed(2),
      userTempGB: (this.getFolderSize(dirs.userTempDir) / 1024 / 1024 / 1024).toFixed(2),
      cacheGB: (this.getFolderSize(dirs.cacheDir) / 1024 / 1024 / 1024).toFixed(2),
      recycleGB: (this.getFolderSize(dirs.recycleDir) / 1024 / 1024 / 1024).toFixed(2),
      userGB: (this.getFolderSize(dirs.userDir) / 1024 / 1024 / 1024).toFixed(2),
    };
  });
}
}
module.exports = new OptimiserService();