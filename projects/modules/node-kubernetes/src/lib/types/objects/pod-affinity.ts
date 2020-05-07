import { MatchExpression } from './match-expression';

export interface PodAffinity {
  labelSelector: {
    matchExpressions: MatchExpression[];
  };
  topologyKey: string;
}