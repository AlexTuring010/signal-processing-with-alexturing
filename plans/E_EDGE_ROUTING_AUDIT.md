# Phase E.4.6 — Edge-routing retrofit audit

> Produced by E.4.6.0 (`feat(viz/edge-routing): …`) as the queue for the
> per-viz retrofit chunks E.4.6.1…N. One chunk per turn going forward,
> same cadence as Phases A–D.

The shared utility `components/viz/edge-routing.ts` (`routeEdge(a, b,
allNodes, options?)`) is **already in use** in `RiverCrossingStateGraph.tsx`
(the point-fix from commit `e75b4cb` is gone). Every viz in the table below
is a candidate for the same retrofit: replace hand-rolled `<line>` / `<path>`
edge rendering with a `routeEdge()` call that runs collision-aware routing
by construction.

**Most retrofits will be visual no-ops** — the existing layouts were chosen
to avoid edge-through-node bugs, and routeEdge returns a straight line when
the segment clears every non-endpoint rect. Any straight line that comes
back curved is either fixing a latent bug (good, ship it) or a false
positive on a near-miss (rare — file a follow-up to widen the rect's
padding or shrink the node).

**Honest scope.** This audit covers vizzes that draw edges *between
rect-or-circle nodes whose positions are determined by a layout function*.
Out of scope: chart axes, sliders, sparklines, Gantt bars, DP tables,
sort-comparison arrows, trees rendered with hard-coded path strings (no
positioned «nodes» per se), and overlay annotations.

---

## Layout families & retrofit chunks

Group by shared layout / node-rect convention. Each chunk = one turn.

### Chunk B1 — L09 MST family (shared `mst-graph.ts`) ✅ DONE 2026-05-25

7 circular nodes (`MST_NODE_R = 21`), 12 weighted edges, planar wheel
layout. Edges are drawn with `trimmedEdge()` (boundary-to-boundary) as
`<line>`. Layout has no straight edges that pass through unrelated nodes
today, so the retrofit will be a no-op in steady state — but locks the
class of bug out structurally for any future edit that re-positions a
node or adds an edge.

- `components/viz/PrimAnimator.tsx` ✅
- `components/viz/KruskalAnimator.tsx` ✅
- `components/viz/ReverseDeleteAnimator.tsx` ✅
- `components/viz/CutExplorer.tsx` ✅
- `components/viz/ExchangeArgumentViz.tsx` ✅
- `components/viz/CycleCutLemmaViz.tsx` ✅
- `components/viz/PrimVsDijkstraViz.tsx` ✅
- `components/viz/DijkstraProofViz.tsx` ✅ (custom 4-node directed layout — folded in)
- `components/viz/DijkstraAnimator.tsx` ✅ (custom 6-node directed layout, NOT mst-graph — folded in)
- `components/viz/DijkstraInvariantBreak.tsx` ✅ (custom 4-node layout — folded in for symmetry)

**Retrofit shape (as executed).** For the 7 mst-graph consumers: a new
`routeMstEdge(a, b)` helper in `mst-graph.ts` pre-computes `MST_RECTS` at
module scope and dispatches to `routeEdge()`; the line case returns
fields byte-identical to `trimmedEdge()` so consumers see no visual
delta in steady state, while the curve case carries the Bezier d-string
plus a label-anchor at the Bezier midpoint `(P0 + 2Q + P2) / 4`. Each
consumer's edge map (and any halo/glow underlay map) gained a
`g.kind === 'line' ? <line> : <path d={g.d} fill="none">` branch —
styling/coloring/animation logic untouched. For the 3 directed-graph
vizzes a new `trimEdgeGeom()` helper in `edge-routing.ts` trims both
endpoints to circle borders for line AND curve cases (tangent-direction
trim on curves, so arrowheads still land on the boundary). 5 new tests
in `edge-routing.test.ts` lock both the byte-identical contract (over
all 12 MST_EDGES) and the perturbed-collision case. See
[[phase-e46-chunk-b1]].

### Chunk B2 — L08 directed / undirected base graphs ✅ DONE 2026-05-25

Bespoke layouts per viz, mix of `<rect>` and `<circle>` nodes. Most are
hand-positioned 5–10 node graphs.

- `components/viz/StrongConnectivityViz.tsx` ✅ (directed, 6 nodes R=21)
- `components/viz/DirectedDegreeViz.tsx` ✅ (directed, 6 nodes R=24; mx/my label anchor)
- `components/viz/DirectedReachExplorer.tsx` ✅ (directed, 6 nodes R=22; fwd trimPad=R+2, ghost reverse trimPad=R+8)
- `components/viz/MutualReachabilityExplorer.tsx` ✅ (directed, 5 nodes R=22)
- `components/viz/OddCycleProof.tsx` ✅ (undirected level-banded, 9 nodes r=20; tree edges + same-level "bad" edge)
- `components/viz/OddCycleColoring.tsx` ✅ (undirected ring, dynamic k ∈ {3..8} r=22; useMemo rects; closing-edge label anchored at Bezier midpoint)
- `components/viz/ComponentSweep.tsx` ✅ (undirected 3-component, 13 nodes r=18, 14 edges)
- `components/viz/WhyBFSFailsWeighted.tsx` ✅ (4 nodes R=22; 3 detour edges retrofitted, the s-t arc stays hand-crafted by design — explicit comment)
- `components/viz/BipartiteChecker.tsx` ✅ (undirected level-banded, dynamic between two layouts; useMemo rects)

**Retrofit shape (as executed).** Mirror of Chunk B1's patterns, applied
per viz with no new shared helper:

- For the 4 directed graphs: build module-scope `NODE_RECTS` +
  `NODE_RECT_BY_ID` from each viz's NODES, plus a per-file `routedEdge(a,
  b)` that calls `routeEdge() → trimEdgeGeom()` with trim radius `R + 2`
  (preserves the pre-retrofit border gap byte-identical for the line
  case). `DirectedReachExplorer` takes a `trimPad` parameter so the
  ghost reverse edges keep their `R + 8` wider gap.
  `DirectedDegreeViz`'s `routedEdge` additionally returns `mx, my` so the
  "next edge" label anchors at the Bezier midpoint when a curve fires.
- For the 4 static-layout undirected graphs (OddCycleProof,
  ComponentSweep) and the dynamic-layout ones (OddCycleColoring,
  BipartiteChecker): same shape minus the `trimEdgeGeom` step (these
  vizzes draw center-to-center). The dynamic vizzes build `nodeRects`
  via `useMemo` so the routing recomputes when `k`/`which` changes.
- WhyBFSFailsWeighted is hybrid: the 3 detour edges adopt the standard
  pattern; the s-t arc is a deliberate visual-separation design choice
  (over-the-top curve) and intentionally bypasses `routeEdge`. The
  exception is documented inline in the `routedEdge` JSDoc.
- Every consumer that previously used a local `endpoints()` / `trim()`
  helper now branches on `g.kind === 'line' ? <line …> : <path d={g.d}
  fill="none" …>`. Styling, marker arrows, strokeDasharray, opacity all
  carry over unchanged.

**Steady-state visual contract:** every edge in every B2 viz routes as
a line on the current layout — verified by inspection (none of the
layouts have an unrelated node sitting on any edge centerline). The line
case is byte-identical to the pre-retrofit output (same as B1). No
user-visible change today; the value is structural lockout per the
audit's standing thesis.

**No new tests required.** B2 introduces no new helper (the building
blocks `routeEdge` and `trimEdgeGeom` were both tested in B1's 20-test
suite, which still passes 20/20). A future layout edit that breaks
collision-freeness would surface as a visible curve in the viz — that's
the regression channel.

### Chunk B3 — L06 / L07 base-graph vizzes

The «graphs from first principles» catalogue. Most are 6–12 node hand-
positioned graphs.

- `components/viz/GraphRepresentations.tsx`
- `components/viz/HandshakeLemmaViz.tsx`
- `components/viz/PathBuilder.tsx`
- `components/viz/ConnectivityExplorer.tsx`
- `components/viz/CycleExplorer.tsx`
- `components/viz/TreeThreeProperties.tsx`
- `components/viz/RootedTreeReroot.tsx`
- `components/viz/MetroModelingViz.tsx`
- `components/viz/DfsTreeBuilder.tsx`
- `components/viz/GenericSearchExplorer.tsx`
- `components/viz/BfsLayerTheorem.tsx`
- `components/viz/BfsEdgeProperty.tsx`
- `components/viz/ComplexityTightVsLoose.tsx`
- `components/viz/GraphCanvas.tsx` (reusable base — confirm if drawn here or per-consumer)

### Chunk B4 — L17 Bellman-Ford family

4–6 node weighted directed graphs, edges with weight labels.

- `components/viz/BellmanFordAnimator.tsx`
- `components/viz/NegativeCycleWalk.tsx`
- `components/viz/DijkstraNegFail.tsx`
- `components/viz/ConstantShiftFail.tsx`
- `components/viz/TreeIndependentSet.tsx`
- `components/viz/WhyTwoTreeValues.tsx`

### Chunk B5 — L10 Union-Find / heap forest layouts

Tree-shaped layouts with parent-child arrows. Shared `uf-layout.ts`
already centralises positions for the union-find family.

- `components/viz/UnionFindForest.tsx`
- `components/viz/UnionBySizeRace.tsx`
- `components/viz/PathCompressionViz.tsx`
- `components/viz/BinaryHeapAnimator.tsx`
- `components/viz/HeapArrayMap.tsx`
- `components/viz/HeapsortAnimator.tsx`
- `components/viz/HuffmanTreeBuilder.tsx`
- `components/viz/HuffmanSwapViz.tsx`
- `components/viz/HuffmanOptimalityViz.tsx`
- `components/viz/TreeMatchingPeel.tsx`

### Chunk B6 — L12 topo / DAG family

Layered DAG layouts, source-walk visualisations.

- `components/viz/TopologicalSortViz.tsx`
- `components/viz/TopoOrderBuilder.tsx`
- `components/viz/DagSourceWalk.tsx`
- `components/viz/LayeredSubsetsDAG.tsx`
- `components/viz/LayeredTripPlanner.tsx`
- `components/viz/DAGUnreliableTwoWays.tsx`
- `components/viz/DagAveragePathCost.tsx`
- `components/viz/NegativeCycleDetector.tsx`

### Chunk B7 — Problem-bank scenario graphs

Bespoke per-problem layouts, mostly 4–7 nodes.

- `components/viz/RiverCrossingStateGraph.tsx` ✅ **DONE** (E.4.6.0 — this commit)
- `components/viz/RiverCrossingGame.tsx`
- `components/viz/CyclingTripScene.tsx`
- `components/viz/SightseeingScene.tsx`
- `components/viz/PartyDegreeFilter.tsx`
- `components/viz/ComponentsBfsSweep.tsx`
- `components/viz/MultVsAddPaths.tsx`
- `components/viz/ReliabilityLogTransform.tsx`
- `components/viz/SegmentCrossingsToInversions.tsx`
- `components/viz/DijkstraTreeVsMstTriangle.tsx`
- `components/viz/DijkstraHandTrace.tsx`
- `components/viz/MstRunnerWithTies.tsx`
- `components/viz/MstCountingExplorer.tsx`
- `components/viz/MstPreorderTSP.tsx`
- `components/viz/SecondVsThirdEdgeMst.tsx`
- `components/viz/MaxEdgeAsBridge.tsx`
- `components/viz/SightseeingDP.tsx`
- `components/viz/WeightedIntervalDP.tsx`
- `components/viz/RecursionExplosion.tsx`
- `components/viz/RestaurantSpacingDP.tsx`
- `components/viz/LamppostsMISViz.tsx`
- `components/viz/RodCuttingDP.tsx`
- `components/viz/GreedyVsDpRelaxation.tsx`
- `components/viz/EditGraphViz.tsx`
- `components/viz/GreedyColoringOrders.tsx`
- `components/viz/MaxHeapKeyDecrease.tsx`
- `components/viz/KnapsackToIntervalScheduling.tsx`
- `components/viz/PjExplorer.tsx`
- `components/viz/GreedyFailsWeighted.tsx`
- `components/viz/AlignmentBuilder.tsx`
- `components/viz/PathBuilder.tsx`
- `components/viz/FloodFillGrid.tsx`
- `components/viz/InternetPlanCounter.tsx`
- `components/viz/TopoSortClassMatrix.tsx`
- `components/viz/UnitIntervalCover.tsx`
- `components/viz/LaundryFlowShop.tsx`
- `components/viz/HuffmanEncodeDecode.tsx`

Chunk B7 is large — the executor should re-split into 3–5-viz sub-chunks
along «shares-a-layout-shape» lines after a closer pass through each file.

---

## Out of scope — confirmed no-inter-node-edges (chart / table / Gantt only)

These render `<line>`/`<path>` but for chart axes, sliders, sparklines,
table grids, Gantt bars, or recursion-tree branches without rect-positioned
nodes. They do not exhibit the «edge through unrelated node» class of bug.

- `BigOPlayground.tsx`, `DefinitionPlayground.tsx`, `LimitRatioPlot.tsx`,
  `OscillatorComparison.tsx`, `StrictVsLooseExplorer.tsx`,
  `AsymptoticVerdictExplorer.tsx`, `SandwichTheoremViz.tsx`,
  `ExponentiationBreaksO.tsx`, `HierarchyRace.tsx`, `FasterComputerLab.tsx`
  — function-growth charts
- `LogVsLinearRace.tsx`, `ComplexityCasesExplorer.tsx`,
  `InstanceDimensionLab.tsx`, `ComplexityTightVsLoose.tsx` — bar / formula
  comparisons
- `SortRace.tsx`, `TwoPointerMerge.tsx`, `MergeSortAnimator.tsx`,
  `InversionCounter.tsx`, `InversionTypeExplorer.tsx`,
  `DominantColourProof.tsx`, `DominantColourBoard.tsx`,
  `RecursionTreeBranching.tsx`, `KaratsubaStep.tsx`, `HanoiAnimator.tsx`,
  `SplitRatioExplorer.tsx`, `DecisionTreeLowerBound.tsx`,
  `OneDClosestPair.tsx`, `QuadrantSplitFail.tsx`, `MedianLineSplit.tsx`,
  `StripJustification.tsx`, `DeltaHalfBoxes.tsx`, `PresortTrick.tsx`,
  `PeakFinder.tsx`, `ClosestPairScan.tsx` — array / grid / chart vizzes
- `IntervalScheduling.tsx`, `IntervalPartitionAnimator.tsx`,
  `GreedyHorizon.tsx`, `GreedyStaysAhead.tsx`, `LatenessScheduler.tsx`,
  `LatenessExchangeViz.tsx`, `GasStationsGreedy.tsx`,
  `AlternatingPeaksValleys.tsx`, `GridGreedyVsOpt.tsx` — Gantt / interval
  bars
- `KnapsackTable.tsx`, `KnapsackGreedyFail.tsx`, `KnapsackWhyTwoVars.tsx`,
  `PseudoPolyExplorer.tsx`, `SubsequenceExplorer.tsx`, `LcsTable.tsx`,
  `EditDistanceTable.tsx`, `TwoRowSweep.tsx`, `HirschbergViz.tsx`,
  `PjScan.tsx`, `DPTableLowerBound.tsx` — DP tables / 2D grids
- `CompressionCostLab.tsx`, `PrefixDecoder.tsx` — Huffman bars / decoder
  tree-walk
- `BinarySearchViz.tsx`, `RecallDrill.tsx`, `TraversalGame.tsx` —
  array-state UIs

(Each is one quick `Read` to confirm in the chunk turn it lives in — do
not retrofit blindly. If on second read a viz here actually draws edges
between positioned nodes, promote it to a Chunk B7 sub-batch.)

---

## Adoption rules (binding for every chunk turn)

1. **Build `NodeRect[]` from the viz's existing layout map.** For
   rectangular nodes, the rect IS the AABB. For circular nodes, use the
   bounding square `{x: cx-r, y: cy-r, w: 2r, h: 2r}` — conservative, but
   correct.
2. **Always include ALL graph nodes in `allNodes`.** Endpoint filtering is
   done by `routeEdge` via `id` matching.
3. **Stable ids.** Whatever the viz uses to identify nodes (numeric state,
   letter, index) must be passed as `NodeRect.id` so endpoint exclusion
   works.
4. **Adopt the geometry, not the style.** `routeEdge` returns geometry
   only (`{kind: 'line', x1,y1,x2,y2}` or `{kind: 'curve', d, cx, cy}`).
   Stroke colour, width, dasharray, animation — all stay in the consumer.
5. **No new client-side dependencies.** `routeEdge` is pure and runs at
   render time. No state, no effects, no reflow cost (it's a few μs per
   edge).
6. **Per-chunk acceptance.** `typecheck` + `lint` + `test` + `build` all
   pass. Spot-check the retrofitted viz in light + dark + mobile widths.
   Most retrofits should be visual no-ops; any straight-line-becomes-curve
   that is NOT a latent bug fix is a follow-up (file it, don't suppress).
