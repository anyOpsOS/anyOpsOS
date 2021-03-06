/**
 * Action to change a cell's geometry in a model.
 *
 * Constructor: mxGeometryChange
 *
 * Constructs a change of a geometry in the
 * specified model.
 */
export interface mxGeometryChange {
  model: any;
  cell: any;
  geometry: any;
  previous: any;
  (model: any, cell: any, geometry: any): void;
  /**
   * Changes the geometry of <cell> ro <previous> using
   * <mxGraphModel.geometryForCellChanged>.
   */
  execute(): void;
}
