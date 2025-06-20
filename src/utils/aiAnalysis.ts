
// AI Analysis Engine for VM Health Monitoring

export interface AnalysisResult {
  status: 'healthy' | 'warning' | 'critical';
  score: number; // 0-100
  issues: string[];
  recommendations: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface VMMetrics {
  cpu: number;
  ram: number;
  disk: number;
  uptime: string;
  processCount?: number;
  networkLatency?: number;
}

export class VMHealthAnalyzer {
  // หลักการวิเคราะห์ที่ใช้
  private static readonly THRESHOLDS = {
    cpu: {
      healthy: 60,    // < 60% = ปกติ
      warning: 80,    // 60-80% = เตือน
      critical: 90    // > 80% = วิกฤต
    },
    ram: {
      healthy: 70,    // < 70% = ปกติ
      warning: 85,    // 70-85% = เตือน
      critical: 95    // > 85% = วิกฤต
    },
    disk: {
      healthy: 75,    // < 75% = ปกติ
      warning: 90,    // 75-90% = เตือน
      critical: 95    // > 90% = วิกฤต
    }
  };

  static analyzeVM(metrics: VMMetrics): AnalysisResult {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let totalScore = 100;
    let maxSeverity: 'healthy' | 'warning' | 'critical' = 'healthy';

    // วิเคราะห์ CPU
    const cpuAnalysis = this.analyzeCPU(metrics.cpu);
    if (cpuAnalysis.severity !== 'healthy') {
      issues.push(cpuAnalysis.issue);
      recommendations.push(...cpuAnalysis.recommendations);
      totalScore -= cpuAnalysis.impact;
      if (this.getSeverityLevel(cpuAnalysis.severity) > this.getSeverityLevel(maxSeverity)) {
        maxSeverity = cpuAnalysis.severity;
      }
    }

    // วิเคราะห์ RAM
    const ramAnalysis = this.analyzeRAM(metrics.ram);
    if (ramAnalysis.severity !== 'healthy') {
      issues.push(ramAnalysis.issue);
      recommendations.push(...ramAnalysis.recommendations);
      totalScore -= ramAnalysis.impact;
      if (this.getSeverityLevel(ramAnalysis.severity) > this.getSeverityLevel(maxSeverity)) {
        maxSeverity = ramAnalysis.severity;
      }
    }

    // วิเคราะห์ Disk
    const diskAnalysis = this.analyzeDisk(metrics.disk);
    if (diskAnalysis.severity !== 'healthy') {
      issues.push(diskAnalysis.issue);
      recommendations.push(...diskAnalysis.recommendations);
      totalScore -= diskAnalysis.impact;
      if (this.getSeverityLevel(diskAnalysis.severity) > this.getSeverityLevel(maxSeverity)) {
        maxSeverity = diskAnalysis.severity;
      }
    }

    // วิเคราะห์ Uptime Pattern
    const uptimeAnalysis = this.analyzeUptime(metrics.uptime);
    if (uptimeAnalysis.severity !== 'healthy') {
      issues.push(uptimeAnalysis.issue);
      recommendations.push(...uptimeAnalysis.recommendations);
      totalScore -= uptimeAnalysis.impact;
    }

    // AI Composite Analysis - วิเคราะห์รวม
    const compositeAnalysis = this.performCompositeAnalysis(metrics);
    if (compositeAnalysis.length > 0) {
      recommendations.push(...compositeAnalysis);
    }

    return {
      status: maxSeverity,
      score: Math.max(0, totalScore),
      issues,
      recommendations,
      priority: this.determinePriority(maxSeverity, issues.length)
    };
  }

  private static analyzeCPU(cpu: number) {
    if (cpu >= this.THRESHOLDS.cpu.critical) {
      return {
        severity: 'critical' as const,
        issue: `CPU usage critically high (${cpu.toFixed(1)}%)`,
        recommendations: [
          'Identify and terminate resource-heavy processes',
          'Consider vertical scaling (add more CPU cores)',
          'Implement CPU throttling for non-critical services'
        ],
        impact: 40
      };
    } else if (cpu >= this.THRESHOLDS.cpu.warning) {
      return {
        severity: 'warning' as const,
        issue: `CPU usage elevated (${cpu.toFixed(1)}%)`,
        recommendations: [
          'Monitor CPU-intensive processes',
          'Consider load balancing',
          'Schedule maintenance during low-usage periods'
        ],
        impact: 20
      };
    }
    return { severity: 'healthy' as const, issue: '', recommendations: [], impact: 0 };
  }

  private static analyzeRAM(ram: number) {
    if (ram >= this.THRESHOLDS.ram.critical) {
      return {
        severity: 'critical' as const,
        issue: `Memory usage critically high (${ram.toFixed(1)}%)`,
        recommendations: [
          'Clear memory caches and buffers',
          'Restart memory-leaking applications',
          'Add more RAM or enable swap space',
          'Implement memory optimization'
        ],
        impact: 35
      };
    } else if (ram >= this.THRESHOLDS.ram.warning) {
      return {
        severity: 'warning' as const,
        issue: `Memory usage high (${ram.toFixed(1)}%)`,
        recommendations: [
          'Monitor memory-intensive applications',
          'Clear temporary files and caches',
          'Consider memory optimization'
        ],
        impact: 15
      };
    }
    return { severity: 'healthy' as const, issue: '', recommendations: [], impact: 0 };
  }

  private static analyzeDisk(disk: number) {
    if (disk >= this.THRESHOLDS.disk.critical) {
      return {
        severity: 'critical' as const,
        issue: `Disk space critically low (${disk.toFixed(1)}%)`,
        recommendations: [
          'Clean up temporary files and logs',
          'Archive or delete old data',
          'Add additional storage',
          'Implement disk cleanup automation'
        ],
        impact: 30
      };
    } else if (disk >= this.THRESHOLDS.disk.warning) {
      return {
        severity: 'warning' as const,
        issue: `Disk space running low (${disk.toFixed(1)}%)`,
        recommendations: [
          'Clean up unnecessary files',
          'Monitor disk usage trends',
          'Plan for storage expansion'
        ],
        impact: 10
      };
    }
    return { severity: 'healthy' as const, issue: '', recommendations: [], impact: 0 };
  }

  private static analyzeUptime(uptime: string) {
    // Parse uptime to get days
    const uptimeDays = this.parseUptimeToDays(uptime);
    
    if (uptimeDays < 1) {
      return {
        severity: 'warning' as const,
        issue: `Recently restarted (${uptime})`,
        recommendations: [
          'Monitor for stability issues',
          'Check system logs for crash causes',
          'Verify all services started correctly'
        ],
        impact: 5
      };
    }
    return { severity: 'healthy' as const, issue: '', recommendations: [], impact: 0 };
  }

  private static performCompositeAnalysis(metrics: VMMetrics): string[] {
    const recommendations: string[] = [];
    
    // High resource usage pattern
    if (metrics.cpu > 70 && metrics.ram > 70) {
      recommendations.push('System under heavy load - consider load balancing or scaling');
    }
    
    // Resource imbalance
    if (metrics.cpu < 30 && metrics.ram > 80) {
      recommendations.push('Memory-heavy workload detected - optimize memory usage');
    }
    
    if (metrics.cpu > 80 && metrics.ram < 50) {
      recommendations.push('CPU-intensive workload - consider CPU optimization');
    }

    // Storage vs performance
    if (metrics.disk > 90 && (metrics.cpu > 70 || metrics.ram > 70)) {
      recommendations.push('Storage constraints may be affecting performance');
    }

    return recommendations;
  }

  private static getSeverityLevel(severity: string): number {
    switch (severity) {
      case 'healthy': return 0;
      case 'warning': return 1;
      case 'critical': return 2;
      default: return 0;
    }
  }

  private static determinePriority(severity: string, issueCount: number): 'low' | 'medium' | 'high' | 'critical' {
    if (severity === 'critical') return 'critical';
    if (severity === 'warning' && issueCount > 2) return 'high';
    if (severity === 'warning') return 'medium';
    return 'low';
  }

  private static parseUptimeToDays(uptime: string): number {
    const match = uptime.match(/(\d+)d/);
    return match ? parseInt(match[1]) : 0;
  }
}
