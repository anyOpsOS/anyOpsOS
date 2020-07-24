import {Injectable} from '@angular/core';

const base = 1024
const suffixes = ['K', 'M', 'G', 'T', 'P', 'E'] // Equivalents: Ki, Mi, Gi, Ti, Pi, Ei

@Injectable({
  providedIn: 'root'
})
export class AnyOpsOSAppInfrastructureManagerUtilsService {

  constructor() {
  }

  ipInSameSubnet(addr1: string, addr2: string, mask: string): boolean {
    const res1 = [];
    const res2 = [];
    const arr1 = addr1.split('.');
    const arr2 = addr2.split('.');
    const arrmask = mask.split('.');

    for (let i = 0; i < arr1.length; i++) {
      res1.push(parseInt(arr1[i], 10) & parseInt(arrmask[i], 10));
      res2.push(parseInt(arr2[i], 10) & parseInt(arrmask[i], 10));
    }
    return res1.join('.') === res2.join('.');
  }

  // Helper to convert CPU K8S units to numbers
  cpuUnitsToNumber(cpu: string): number {
    const cpuNum = parseInt(cpu, 10)
    const billion = 1000000 * 1000
    if (cpu.includes('m')) return cpuNum / 1000;
    if (cpu.includes('u')) return cpuNum / 1000000;
    if (cpu.includes('n')) return cpuNum / billion;
    return parseFloat(cpu)
  }

  // Helper to convert memory from units Ki, Mi, Gi, Ti, Pi to bytes and vise versa
  unitsToBytes(value: string): number {
    if (!suffixes.some(suffix => value.includes(suffix))) {
      return parseFloat(value)
    }
    const index = suffixes.findIndex(suffix =>
      suffix == value.replace(/[0-9]|i|\./g, '')
    )
    return parseInt(
      (parseFloat(value) * Math.pow(base, index + 1)).toFixed(1),
      10
    )
  }

  bytesToUnits(bytes: number, precision = 1): string {
    const sizes = ['B', ...suffixes]
    const index = Math.floor(Math.log(bytes) / Math.log(base))
    if (!bytes) {
      return 'N/A'
    }
    if (index === 0) {
      return `${bytes}${sizes[index]}`
    }
    return `${(bytes / (1024 ** index)).toFixed(precision)}${sizes[index]}i`
  }
}
