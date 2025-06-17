
import { Franchisee } from '@/types/auth';
import { DuplicateGroup } from '@/types/duplicates';

// Función para normalizar texto para comparación
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[.,\-_]/g, '');
};

// Función para calcular similitud entre dos strings
const calculateSimilarity = (str1: string, str2: string): number => {
  const normalize1 = normalizeText(str1);
  const normalize2 = normalizeText(str2);
  
  if (normalize1 === normalize2) return 1;
  
  const maxLength = Math.max(normalize1.length, normalize2.length);
  if (maxLength === 0) return 1;
  
  const distance = levenshteinDistance(normalize1, normalize2);
  return 1 - distance / maxLength;
};

// Implementación simple de distancia de Levenshtein
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
};

export const detectDuplicates = (franchisees: Franchisee[]): DuplicateGroup[] => {
  console.log('detectDuplicates - Starting detection for', franchisees.length, 'franchisees');
  
  const duplicateMap = new Map<string, DuplicateGroup>();
  
  for (let i = 0; i < franchisees.length; i++) {
    const franchisee1 = franchisees[i];
    console.log(`Processing franchisee ${i + 1}/${franchisees.length}:`, franchisee1.franchisee_name);
    
    for (let j = i + 1; j < franchisees.length; j++) {
      const franchisee2 = franchisees[j];
      
      const reasons: string[] = [];
      let isDuplicate = false;
      
      // Verificar duplicados por nombre
      const nameSimilarity = calculateSimilarity(franchisee1.franchisee_name, franchisee2.franchisee_name);
      if (nameSimilarity > 0.8) {
        reasons.push(`Nombres similares (${Math.round(nameSimilarity * 100)}%)`);
        isDuplicate = true;
      }
      
      // Verificar duplicados por email (si existe)
      if (franchisee1.profiles?.email && franchisee2.profiles?.email) {
        if (franchisee1.profiles.email.toLowerCase() === franchisee2.profiles.email.toLowerCase()) {
          reasons.push('Mismo email');
          isDuplicate = true;
        }
      }
      
      // Verificar duplicados por CIF/NIF
      if (franchisee1.tax_id && franchisee2.tax_id) {
        if (normalizeText(franchisee1.tax_id) === normalizeText(franchisee2.tax_id)) {
          reasons.push('Mismo CIF/NIF');
          isDuplicate = true;
        }
      }
      
      // Verificar duplicados por empresa
      if (franchisee1.company_name && franchisee2.company_name) {
        const companySimilarity = calculateSimilarity(franchisee1.company_name, franchisee2.company_name);
        if (companySimilarity > 0.85) {
          reasons.push(`Empresas similares (${Math.round(companySimilarity * 100)}%)`);
          isDuplicate = true;
        }
      }
      
      if (isDuplicate) {
        const key = `${Math.min(i, j)}_${Math.max(i, j)}`;
        
        if (!duplicateMap.has(key)) {
          duplicateMap.set(key, {
            key,
            franchisees: [franchisee1, franchisee2],
            count: 2,
            reasons
          });
          console.log('Found duplicate group:', franchisee1.franchisee_name, 'vs', franchisee2.franchisee_name, 'Reasons:', reasons);
        }
      }
    }
  }
  
  const duplicateGroups = Array.from(duplicateMap.values());
  console.log('detectDuplicates - Found', duplicateGroups.length, 'duplicate groups');
  
  return duplicateGroups;
};
