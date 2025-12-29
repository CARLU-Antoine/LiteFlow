const si = require('systeminformation');
const { exec } = require('child_process');

class SystemService {
  constructor() {
    this.cpuHistory = [];
    this.maxHistory = 60;
  }

  // ====================================
  // CPU
  // ====================================
  async getCPU() {
    try {
      const currentLoad = await si.currentLoad();
      const timestamp = Math.floor(Date.now() / 1000);
      
      const dataPoint = [
        timestamp,
        Math.round(currentLoad.currentLoadUser),
        Math.round(currentLoad.currentLoadSystem),
        Math.round(currentLoad.currentLoadIdle)
      ];
      
      this.cpuHistory.push(dataPoint);
      
      if (this.cpuHistory.length > this.maxHistory) {
        this.cpuHistory = this.cpuHistory.slice(-this.maxHistory);
      }
      
      return {
        current: {
          user: Math.round(currentLoad.currentLoadUser),
          system: Math.round(currentLoad.currentLoadSystem),
          idle: Math.round(currentLoad.currentLoadIdle),
          total: Math.round(currentLoad.currentLoad),
        },
        data: this.cpuHistory,
      };
    } catch (error) {
      throw new Error('Erreur récupération CPU: ' + error.message);
    }
  }

  // ====================================
  // Mémoire
  // ====================================
  async getMemory() {
    try {
      const mem = await si.mem();
      
      return {
        total: mem.total,
        used: mem.used,
        free: mem.free,
        usedPercent: Math.round((mem.used / mem.total) * 100),
        freePercent: Math.round((mem.free / mem.total) * 100),
        totalGB: (mem.total / 1024 / 1024 / 1024).toFixed(2),
        usedGB: (mem.used / 1024 / 1024 / 1024).toFixed(2),
        freeGB: (mem.free / 1024 / 1024 / 1024).toFixed(2),
      };
    } catch (error) {
      throw new Error('Erreur récupération mémoire: ' + error.message);
    }
  }

  // ====================================
  // Disque
  // ====================================
  async getDisk() {
    try {
      const fsSize = await si.fsSize();
      
      return fsSize.map(disk => ({
        fs: disk.fs,
        type: disk.type,
        size: disk.size,
        used: disk.used,
        available: disk.available,
        usedPercent: Math.round(disk.use),
        mount: disk.mount,
        sizeGB: (disk.size / 1024 / 1024 / 1024).toFixed(2),
        usedGB: (disk.used / 1024 / 1024 / 1024).toFixed(2),
        availableGB: (disk.available / 1024 / 1024 / 1024).toFixed(2),
      }));
    } catch (error) {
      throw new Error('Erreur récupération disque: ' + error.message);
    }
  }

  // ====================================
  // Réseau
  // ====================================
  async getNetwork() {
    try {
      const networkStats = await si.networkStats();
      
      return networkStats.map(net => ({
        iface: net.iface,
        rxBytes: net.rx_bytes,
        txBytes: net.tx_bytes,
        rxSec: net.rx_sec,
        txSec: net.tx_sec,
        rxMB: (net.rx_bytes / 1024 / 1024).toFixed(2),
        txMB: (net.tx_bytes / 1024 / 1024).toFixed(2),
      }));
    } catch (error) {
      throw new Error('Erreur récupération réseau: ' + error.message);
    }
  }

  // ====================================
  // Infos système
  // ====================================
  async getSystemInfo() {
    try {
      const [cpu, os, mem] = await Promise.all([
        si.cpu(),
        si.osInfo(),
        si.mem(),
      ]);
      
      return {
        cpu: {
          manufacturer: cpu.manufacturer,
          brand: cpu.brand,
          cores: cpu.cores,
          physicalCores: cpu.physicalCores,
          speed: cpu.speed,
        },
        os: {
          platform: os.platform,
          distro: os.distro,
          release: os.release,
          arch: os.arch,
          hostname: os.hostname,
        },
        memory: {
          total: mem.total,
          totalGB: (mem.total / 1024 / 1024 / 1024).toFixed(2),
        },
      };
    } catch (error) {
      throw new Error('Erreur récupération infos système: ' + error.message);
    }
  }

  // ====================================
  // Processus
  // ====================================
  async getProcesses(limit = 10) {
    try {
      const processes = await si.processes();
      
      const topProcesses = processes.list
        .sort((a, b) => b.cpu - a.cpu)
        .slice(0, limit)
        .map(proc => ({
          pid: proc.pid,
          name: proc.name,
          cpu: proc.cpu.toFixed(1),
          mem: proc.mem.toFixed(1),
          memBytes: proc.memRss,
        }));
      
      return {
        total: processes.all,
        running: processes.running,
        blocked: processes.blocked,
        sleeping: processes.sleeping,
        topProcesses: topProcesses,
      };
    } catch (error) {
      throw new Error('Erreur récupération processus: ' + error.message);
    }
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
}

module.exports = new SystemService();