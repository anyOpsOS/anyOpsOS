import { MatchExpression } from './match-expression';

export interface NodeAffinity {
  nodeSelectorTerms?: {
    matchExpressions: MatchExpression[];
  }[];
  weight: number;
  preference: {
    matchExpressions: MatchExpression[];
  };
}