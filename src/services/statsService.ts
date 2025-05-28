import { MeasurementDAO } from "@models/dao/MeasurementDAO";
import { SensorDAO } from "@models/dao/SensorDAO";
import { Measurements as MeasurementsDTO } from "@models/dto/Measurements";
import { Measurement as MeasurementDTO } from "@models/dto/Measurement";
import { convertMeasurementDAOToDTO } from "./mapperService";
import { NetworkDAO } from "@models/dao/NetworkDAO";

/**
 * Calcola le statistiche (media, varianza, soglie superiore e inferiore) per un array di numbers.
 *
 * @param values - Array di valori numerici per calcolare le statistiche.
 * @returns Un array contenente:
 *   - average: La media dei valori.
 *   - variance: La varianza dei valori.
 *   - upperThreshold: La soglia superiore (calcolata come \mu + 2\sigma).
 *   - lowerThreshold: La soglia superiore (calcolata come \mu - 2\sigma).
 *   Restituisce [NaN, NaN, NaN, NaN] se non ci sono valori nell'array in input.
 */
export function calculateStats(values: number[]): [number, number, number, number] {
  if (values.length === 0) {
    return [NaN, NaN, NaN, NaN];
  }

  const sum = values.reduce((prev, num) => prev + num, 0);  // Grazie DSTBD!
  const avg = sum/values.length;

  // Provato ad usare Mathjs ma dava problemi coi tipi
  const vari = values.reduce((prev, num) => prev + Math.pow(num - avg, 2), 0) / values.length;
  const std = Math.sqrt(vari);
  
  return [
    avg,          // Media
    vari,         // Varianza
    avg + 2*std,  // Upper Threshold
    avg - 2*std   // Lower Threshold
  ];
}

/**
 * Converte ogni oggetto `MeasurementDAO` in un `MeasurementDTO`, marcandolo come outlier
 * se il suo valore è inferiore a `lowerThreshold` o superiore a `upperThreshold`.
 *
 * @param meases - Array di `MeasurementDAO` da valutare.
 * @param upperThreshold - Soglia superiore oltre la quale una misurazione è considerata outlier.
 * @param lowerThreshold - Soglia inferiore sotto la quale una misurazione è considerata outlier.
 * @returns Un array di `MeasurementDTO`, ciascuno indicante se è un outlier.
 */
function calculateOutliers(meases: MeasurementDAO[], upperThreshold: number, lowerThreshold: number): MeasurementDTO[] {
  return meases.map((m) => convertMeasurementDAOToDTO(m, (m.value < lowerThreshold || m.value > upperThreshold)));
}

/**
 * Crea un array di `MeasurementsDTO`, uno per ogni sensore, contenente statistiche e misurazioni.
 *
 * @param senses - Array di `SensorDAO` rappresentante il set di sensori (che includono le loro misurazioni).
 * @param startDate - Data di inizio delle statistiche di interesse.
 * @param endDate - Data di fine delle statistiche di interesse.
 * @returns Un array di `MeasurementsDTO`, ognuno contenente statistiche e misurazioni.
 * Se non ci sono sensori, l'array restituito risulterà vuoto.
 * Se non ci sono misurazioni per un sensore, ogni Measurements conterrà solo il MAC del sensore corrispondente.
 */
export function createMeasurementsDTOArray(senses: SensorDAO[], startDate: Date, endDate: Date): MeasurementsDTO[] {
  return senses.map((sens) => createMeasurementsDTO(sens, startDate, endDate));
}

/**
 * Crea un `MeasurementsDTO` per un sensore specifico, includendo statistiche e misurazioni.
 *
 * @param sens - SensorDAO rappresentante il sensore specifico (che includono le loro misurazioni).
 * @param startDate - Data di inizio delle statistiche di interesse.
 * @param endDate - Data di fine delle statistiche di interesse.
 * @returns Un `MeasurementsDTO` contenente statistiche e misurazioni.
 * Se non ci sono misurazioni, il Measurement conterrà solo il MAC del sensore.
 */
export function createMeasurementsDTO(sens: SensorDAO, startDate: Date, endDate: Date) {
  const meases = getFilteredMeasurements(sens, startDate, endDate)
  const [mean, vari, upp, low] = calculateStats(meases.map((m) => m.value));

  let mss: MeasurementsDTO = {
    sensorMacAddress: sens.macAddress
  }

  // Se calculateStats ha fallito non riempire i campi facoltativi (ex. length == 0)
  if (!isNaN(mean)) {
    mss = {
      ...mss,
      stats: {
        mean: mean,
        variance: vari,
        upperThreshold: upp,
        lowerThreshold: low,
      },
      measurements: calculateOutliers(meases, upp, low)
    }
    
    // Se la data non è stata inserita non voglio metterla nello stats (altrimenti rompe validazione)
    if (endDate)
      mss.stats = {endDate: endDate, ...mss.stats};

    if (startDate)
      mss.stats = {startDate: startDate, ...mss.stats};
  }

  return mss;
}

/**
 * Filtra le misurazioni di un sensore in base a un intervallo di date.
 *
 * @param sens - Il sensore di cui filtrare le misurazioni.
 * @param startDate - Data di inizio dell'intervallo.
 * @param endDate - Data di fine dell'intervallo.
 * @returns Un array di `MeasurementDAO` che rientrano nell'intervallo specificato.
 * Nel caso in cui uno (o entrambi) degli estremi non sia specificato viene considerato come -Inf o +Inf.
 */
export function getFilteredMeasurements(sens: SensorDAO, startDate: Date, endDate: Date): MeasurementDAO[] {
  return sens.measurement.filter((m) => {
    if (startDate && endDate) {
      return m.createdAt >= startDate && m.createdAt <= endDate;
    }
    else if (startDate) {
      return m.createdAt >= startDate;
    }
    else if (endDate) {
      return m.createdAt <= endDate;
    }

    return true;
  });
}

/**
 * Restituisce tutti i sensori associati alla rete passata.
 *
 * @param network - Il `NetworkDAO` da cui estrarre i sensori.
 * @returns Un array di `SensorDAO` presenti tra tutti i gateway della rete.
 */
export function getSensorsByNetwork(network: NetworkDAO): SensorDAO[] {
  return network.gateways.map((g) => g.sensors).flat();
} 