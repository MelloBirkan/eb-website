"""EB monogram geometry. A B silhouette whose left part (spine + arm stubs) is the E."""
import math


def fmt(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s == "-0" else s


def circle_intersections(c1, r1, c2, r2):
    (x1, y1), (x2, y2) = c1, c2
    d = math.hypot(x2 - x1, y2 - y1)
    a = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
    h = math.sqrt(max(r1 * r1 - a * a, 0))
    xm = x1 + a * (x2 - x1) / d
    ym = y1 + a * (y2 - y1) / d
    p1 = (xm + h * (y2 - y1) / d, ym - h * (x2 - x1) / d)
    p2 = (xm - h * (y2 - y1) / d, ym + h * (x2 - x1) / d)
    return p1, p2


def glyph(H=300.0, w=62.0, mid=0.47, arm=1.15, xr_t=None, xr_b=None, rc=0.7, gap=0.0, ox=0.0, oy=0.0):
    """Return (e_path, b_path, width). Coordinates start at (ox, oy).

    H: cap height, w: stroke, mid: middle bar center as a fraction of H,
    arm: E arm length in strokes (beyond the spine), rc: outer corner radius in strokes,
    gap: cut between E and B parts.
    """
    ym = H * mid
    x_e = w + arm * w  # where E ends and the B bowls begin
    yb_t = ym + w / 2
    Rt = yb_t / 2
    Rb = (H - (ym - w / 2)) / 2
    rt = Rt - w
    rb = Rb - w
    if xr_t is None:
        xr_t = x_e + Rt + 0.12 * H
    if xr_b is None:
        xr_b = xr_t + 0.06 * H
    cx1 = xr_t - Rt
    cx2 = xr_b - Rb
    c1 = (cx1, Rt)
    c2 = (cx2, ym - w / 2 + Rb)
    pts = circle_intersections(c1, Rt, c2, Rb)
    P = max(pts, key=lambda p: p[0])

    X = lambda v: fmt(v + ox)
    Y = lambda v: fmt(v + oy)

    # E: spine with rounded outer corners on the left, three arms ending at x_e - gap/2.
    xe = x_e - gap / 2
    r = rc * w
    m1, m2 = ym - w / 2, ym + w / 2
    e = (
        f"M{X(r)} {Y(0)}H{X(xe)}V{Y(w)}H{X(w)}V{Y(m1)}H{X(xe)}V{Y(m2)}H{X(w)}V{Y(H - w)}H{X(xe)}V{Y(H)}"
        f"H{X(r)}A{fmt(r)} {fmt(r)} 0 0 1 {X(0)} {Y(H - r)}V{Y(r)}A{fmt(r)} {fmt(r)} 0 0 1 {X(r)} {Y(0)}Z"
    )

    xb = x_e + gap / 2
    outer = (
        f"M{X(xb)} {Y(0)}H{X(cx1)}A{fmt(Rt)} {fmt(Rt)} 0 0 1 {X(P[0])} {Y(P[1])}"
        f"A{fmt(Rb)} {fmt(Rb)} 0 0 1 {X(cx2)} {Y(H)}H{X(xb)}Z"
    )
    hole_t = f"M{X(xb)} {Y(w)}H{X(cx1)}A{fmt(rt)} {fmt(rt)} 0 0 1 {X(cx1)} {Y(m1)}H{X(xb)}Z"
    hole_b = f"M{X(xb)} {Y(m2)}H{X(cx2)}A{fmt(rb)} {fmt(rb)} 0 0 1 {X(cx2)} {Y(H - w)}H{X(xb)}Z"
    b = outer + hole_t + hole_b
    return e, b, xr_b
