const si = require('systeminformation');

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
}

module.exports = new SystemService();