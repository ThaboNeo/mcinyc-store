"use client";
import { useState, useEffect } from "react";
 
const TERRACOTTA = "#C85B2A";
const GOLD = "#E8C547";
const CREAM = "#F0EAD6";
const DARK = "#0F0E0B";
const MID = "#1C1A16";
 type Colorway = {
  label: string;
  shirt: string;
  text: string;
  sub: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  tag: string;
  sizes: string[];
  description: string;
  details: string[];
  colorways: Colorway[];
  printFront: (tc: string, sc: string) => React.ReactNode;
};

type CartItem = {
  cartId: string;
  productId: string;
  name: string;
  price: number;
  colorIdx: number;
  colorLabel: string;
  size: string;
  qty: number;
};
const PRODUCTS = [
  {
    id: "ancestor-tee",
    name: "The Ancestor Tee",
    price: 48,
    tag: "HERITAGE DROP",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    description: "Heavyweight 100% organic cotton. Screen-printed with archival inks. Wear your roots, not theirs.",
    details: ["340gsm organic ring-spun cotton", "Unisex relaxed fit", "Pre-washed, pre-shrunk", "Screen-printed in the USA"],
    colorways: [
      { label: "Midnight", shirt: "#1A1614", text: GOLD, sub: TERRACOTTA },
      { label: "Terracotta", shirt: TERRACOTTA, text: CREAM, sub: DARK },
      { label: "Forest", shirt: "#2D5016", text: "#D4E8C2", sub: GOLD },
    ],
    printFront: (tc: string, sc: string) => (
      <g fontFamily="'Playfair Display', serif" textAnchor="middle">
        <path d="M175 175 Q210 168 245 175" stroke={sc} strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M165 285 Q210 292 255 285" stroke={sc} strokeWidth="1.5" fill="none" opacity="0.6"/>
        <text x="210" y="205" fontSize="22" fontWeight="900" fill={tc} letterSpacing="2">MY CULTURE</text>
        <text x="210" y="228" fontSize="11" fontFamily="monospace" fill={tc} opacity="0.75" letterSpacing="4">IS NOT</text>
        <text x="210" y="258" fontSize="20" fontWeight="700" fontStyle="italic" fill={sc}>Your Costume.</text>
        <text x="210" y="280" fontSize="8" fontFamily="monospace" fill={tc} opacity="0.5" letterSpacing="3">EST. 2025 · RECLAIM</text>
      </g>
    ),
  },
  {
    id: "sovereignty-crew",
    name: "The Sovereignty Crewneck",
    price: 88,
    tag: "CORE COLLECTION",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    description: "French terry crewneck. Relaxed fit. Sovereignty looks good on everyone.",
    details: ["380gsm French terry", "Ribbed cuffs & hem", "Embroidered back neck label", "Ethically made"],
    colorways: [
      { label: "Indigo", shirt: "#1A1A2E", text: "#AED9DA", sub: GOLD },
      { label: "Bone", shirt: CREAM, text: DARK, sub: TERRACOTTA },
      { label: "Midnight", shirt: "#1A1614", text: GOLD, sub: TERRACOTTA },
    ],
    printFront: (tc: string, sc: string) => (
      <g fontFamily="'Playfair Display', serif" textAnchor="middle">
        <circle cx="210" cy="228" r="58" stroke={tc} strokeWidth="1" fill="none" opacity="0.4"/>
        <text x="210" y="188" fontSize="8" fontFamily="monospace" fill={tc} opacity="0.6" letterSpacing="3">SOVEREIGNTY</text>
        <text x="210" y="232" fontSize="32" fontWeight="900" fontStyle="italic" fill={sc}>MINE.</text>
        <text x="210" y="258" fontSize="7.5" fontFamily="monospace" fill={tc} opacity="0.55" letterSpacing="1.5">MY CULTURE IS NOT</text>
        <text x="210" y="272" fontSize="7.5" fontFamily="monospace" fill={tc} opacity="0.55" letterSpacing="1.5">YOUR COSTUME.</text>
      </g>
    ),
  },
  {
    id: "reclaim-jacket",
    name: "The Reclaim Jacket",
    price: 165,
    tag: "STATEMENT WEAR",
    sizes: ["S", "M", "L", "XL", "2XL"],
    description: "Oversized utility silhouette with embroidered chest and back. Unapologetic.",
    details: ["100% organic twill", "YKK zippers", "Hand-embroidered chest patch", "Drop shoulder fit"],
    colorways: [
      { label: "Olive", shirt: "#4A5240", text: GOLD, sub: TERRACOTTA },
      { label: "Midnight", shirt: "#1A1614", text: GOLD, sub: TERRACOTTA },
      { label: "Rust", shirt: "#8B3A18", text: CREAM, sub: GOLD },
    ],
    printFront: (tc: string, sc: string) => (
      <g fontFamily="'Playfair Display', serif" textAnchor="middle">
        <rect x="168" y="178" width="84" height="96" rx="2" stroke={tc} strokeWidth="1" fill="none" opacity="0.5"/>
        <text x="210" y="200" fontSize="9" fontFamily="monospace" fill={tc} opacity="0.7" letterSpacing="2">THE RECLAIM</text>
        <text x="210" y="228" fontSize="22" fontWeight="900" fill={sc}>JACKET</text>
        <line x1="175" y1="238" x2="245" y2="238" stroke={tc} strokeWidth="0.75" opacity="0.4"/>
        <text x="210" y="254" fontSize="8" fill={tc} opacity="0.65">MY CULTURE</text>
        <text x="210" y="266" fontSize="8" fontStyle="italic" fill={tc} opacity="0.65">is not your costume.</text>
      </g>
    ),
  },
  {
    id: "diaspora-hoodie",
    name: "Diaspora Hoodie",
    price: 98,
    tag: "COLLECTOR'S PIECE",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    description: "For everywhere the wind has scattered us. Heavyweight pullover with hand-illustrated hem embroidery.",
    details: ["420gsm fleece", "Kangaroo pocket", "Adjustable drawstring", "Embroidered hem band"],
    colorways: [
      { label: "Forest", shirt: "#2D5016", text: "#D4E8C2", sub: GOLD },
      { label: "Midnight", shirt: "#1A1614", text: GOLD, sub: TERRACOTTA },
      { label: "Plum", shirt: "#4A1942", text: "#F2D4EC", sub: GOLD },
    ],
    printFront: (tc: string, sc: string) => (
      <g fontFamily="'Playfair Display', serif" textAnchor="middle">
        <text x="210" y="192" fontSize="8" fontFamily="monospace" fill={tc} opacity="0.6" letterSpacing="3">DIASPORA</text>
        <text x="210" y="228" fontSize="26" fontWeight="900" fill={tc}>scattered.</text>
        <text x="210" y="258" fontSize="24" fontWeight="700" fontStyle="italic" fill={sc}>rooted.</text>
        <line x1="178" y1="267" x2="242" y2="267" stroke={tc} strokeWidth="0.75" opacity="0.35"/>
        <text x="210" y="279" fontSize="6.5" fontFamily="monospace" fill={tc} opacity="0.45" letterSpacing="2">MY CULTURE IS NOT YOUR COSTUME</text>
      </g>
    ),
  },
  {
    id: "not-for-you-tote",
    name: "Not For You Tote",
    price: 35,
    tag: "CARRY IT",
    sizes: ["One Size"],
    description: "Heavy canvas. The bag that says exactly what you mean.",
    details: ["14oz natural canvas", "Reinforced handles", "Interior zip pocket", "Screen printed both sides"],
    colorways: [
      { label: "Natural", shirt: "#E8E0CC", text: DARK, sub: TERRACOTTA },
      { label: "Black", shirt: "#1A1614", text: CREAM, sub: GOLD },
      { label: "Terracotta", shirt: TERRACOTTA, text: CREAM, sub: DARK },
    ],
    printFront: (tc: string, sc: string) => (
      <g fontFamily="'Playfair Display', serif" textAnchor="middle">
        <text x="210" y="198" fontSize="10" fontFamily="monospace" fill={tc} opacity="0.7" letterSpacing="3">NOT</text>
        <text x="210" y="238" fontSize="34" fontWeight="900" fill={sc}>FOR</text>
        <text x="210" y="268" fontSize="28" fontWeight="700" fontStyle="italic" fill={tc}>you.</text>
        <line x1="182" y1="276" x2="238" y2="276" stroke={tc} strokeWidth="0.75" opacity="0.35"/>
        <text x="210" y="288" fontSize="6.5" fontFamily="monospace" fill={tc} opacity="0.45" letterSpacing="1.5">MY CULTURE IS NOT YOUR COSTUME</text>
      </g>
    ),
  },
  {
    id: "bucket-hat",
    name: "Diaspora Bucket Hat",
    price: 42,
    tag: "ACCESSORIES",
    sizes: ["S/M", "L/XL"],
    description: "Wherever the wind scattered us, we arrive with intention.",
    details: ["100% organic canvas", "Embroidered panel", "Packable brim", "Adjustable cord"],
    colorways: [
      { label: "Midnight", shirt: "#1A1614", text: GOLD, sub: TERRACOTTA },
      { label: "Forest", shirt: "#2D5016", text: "#D4E8C2", sub: GOLD },
      { label: "Bone", shirt: CREAM, text: DARK, sub: TERRACOTTA },
    ],
    printFront: (tc: string, sc: string) => (
      <g fontFamily="'Playfair Display', serif" textAnchor="middle">
        <circle cx="210" cy="228" r="50" stroke={tc} strokeWidth="1" fill="none" opacity="0.35"/>
        <text x="210" y="200" fontSize="8" fontFamily="monospace" fill={tc} opacity="0.6" letterSpacing="3">DIASPORA</text>
        <text x="210" y="232" fontSize="22" fontWeight="700" fontStyle="italic" fill={sc}>Rooted.</text>
        <text x="210" y="252" fontSize="7.5" fontFamily="monospace" fill={tc} opacity="0.55" letterSpacing="1.5">MY CULTURE IS NOT</text>
        <text x="210" y="265" fontSize="7.5" fontStyle="italic" fill={tc} opacity="0.55">your costume.</text>
      </g>
    ),
  },
];
 
function ShirtSVG({ product, colorIdx = 0, size = 320 }: { product: Product; colorIdx?: number; size?: number }) {
  const cw = product.colorways[colorIdx];
  const h = size * (460 / 420);
  const filterId = `shadow-${product.id}-${colorIdx}`;
  const gradId = `grad-${product.id}-${colorIdx}`;
 
  return (
    <svg viewBox="0 0 420 460" width={size} height={h} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <filter id={filterId} x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#000" floodOpacity="0.4" />
        </filter>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.12" />
        </linearGradient>
        <clipPath id={`clip-${product.id}-${colorIdx}`}>
          <path d="M118 220 L100 155 L75 200 L60 90 C80 82 100 72 130 62 C148 56 162 50 176 48 C185 46 194 44 210 44 C226 44 235 46 244 48 C258 50 272 56 290 62 C320 72 340 82 360 90 L345 200 L320 155 L302 220 L302 420 L118 420 Z" />
        </clipPath>
      </defs>
      <g filter={`url(#${filterId})`}>
        <polygon points="60,90 10,175 75,200 100,155 118,220" fill={cw.shirt} />
        <polygon points="360,90 410,175 345,200 320,155 302,220" fill={cw.shirt} />
        <path d="M118 220 L100 155 L75 200 L60 90 C80 82 100 72 130 62 C148 56 162 50 176 48 C185 46 194 44 210 44 C226 44 235 46 244 48 C258 50 272 56 290 62 C320 72 340 82 360 90 L345 200 L320 155 L302 220 L302 420 L118 420 Z" fill={cw.shirt} />
        <path d="M176 48 C185 46 194 44 210 44 C226 44 235 46 244 48 C235 70 226 82 210 86 C194 82 185 70 176 48 Z" fill={cw.shirt} stroke={cw.text} strokeWidth="0.75" strokeOpacity="0.2" />
      </g>
      <path d="M118 220 L100 155 L75 200 L60 90 C80 82 100 72 130 62 C148 56 162 50 176 48 C185 46 194 44 210 44 C226 44 235 46 244 48 C258 50 272 56 290 62 C320 72 340 82 360 90 L345 200 L320 155 L302 220 L302 420 L118 420 Z" fill={`url(#${gradId})`} />
      <polygon points="60,90 10,175 75,200 100,155 118,220" fill={`url(#${gradId})`} />
      <polygon points="360,90 410,175 345,200 320,155 302,220" fill={`url(#${gradId})`} />
      <line x1="118" y1="220" x2="118" y2="420" stroke={cw.text} strokeWidth="0.6" strokeDasharray="4 4" opacity="0.15" />
      <line x1="302" y1="220" x2="302" y2="420" stroke={cw.text} strokeWidth="0.6" strokeDasharray="4 4" opacity="0.15" />
      <line x1="118" y1="413" x2="302" y2="413" stroke={cw.text} strokeWidth="0.6" strokeDasharray="3 3" opacity="0.2" />
      <g clipPath={`url(#clip-${product.id}-${colorIdx})`}>
        {product.printFront(cw.text, cw.sub)}
      </g>
    </svg>
  );
}
 
const qtyBtn = {
  width: 28, height: 28, background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)", color: CREAM,
  fontSize: 16, cursor: "pointer", borderRadius: 2,
  display: "flex", alignItems: "center", justifyContent: "center",
};
 
function CartDrawer({ cart, setCart, open, onClose }: { cart: CartItem[]; setCart: React.Dispatch<React.SetStateAction<CartItem[]>>; open: boolean; onClose: () => void }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
 
  function updateQty(cartId, delta) {
    setCart(prev =>
      prev.map(i => i.cartId === cartId ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0)
    );
  }
 
  return (
    <>
      {open && (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", zIndex: 200 }} />
      )}
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100dvh",
        width: "min(420px, 100vw)", background: MID,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(.22,1,.36,1)",
        zIndex: 201, display: "flex", flexDirection: "column",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ color: CREAM, fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>Your Cart</span>
          <span style={{ color: CREAM, opacity: 0.5, fontFamily: "monospace", fontSize: 12 }}>{cart.reduce((s, i) => s + i.qty, 0)} items</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: CREAM, fontSize: 22, cursor: "pointer", opacity: 0.6, padding: "0 4px" }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {cart.length === 0 && (
            <p style={{ color: CREAM, opacity: 0.4, fontFamily: "monospace", fontSize: 13, marginTop: 40, textAlign: "center" }}>Your cart is empty.</p>
          )}
          {cart.map(item => {
            const p = PRODUCTS.find(p => p.id === item.productId);
            if (!p) return null;
            return (
              <div key={item.cartId} style={{ display: "flex", gap: 14, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ flexShrink: 0 }}>
                  <ShirtSVG product={p} colorIdx={item.colorIdx} size={60} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: CREAM, fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{item.name}</div>
                  <div style={{ color: CREAM, opacity: 0.5, fontFamily: "monospace", fontSize: 11, marginBottom: 8 }}>{item.colorLabel} / {item.size}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button onClick={() => updateQty(item.cartId, -1)} style={qtyBtn}>−</button>
                    <span style={{ color: CREAM, fontFamily: "monospace", fontSize: 13, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.cartId, 1)} style={qtyBtn}>+</button>
                    <button onClick={() => updateQty(item.cartId, -item.qty)} style={{ marginLeft: "auto", background: "none", border: "none", color: CREAM, opacity: 0.35, cursor: "pointer", fontSize: 11, fontFamily: "monospace" }}>REMOVE</button>
                  </div>
                </div>
                <div style={{ color: CREAM, fontFamily: "monospace", fontSize: 14, flexShrink: 0 }}>${item.price * item.qty}</div>
              </div>
            );
          })}
        </div>
        <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ color: CREAM, fontFamily: "monospace", fontSize: 13, opacity: 0.6 }}>Subtotal</span>
            <span style={{ color: CREAM, fontFamily: "monospace", fontSize: 16, fontWeight: 700 }}>${total.toFixed(2)}</span>
          </div>
          <button style={{ width: "100%", padding: "16px", background: TERRACOTTA, border: "none", color: DARK, fontFamily: "monospace", fontWeight: 700, fontSize: 13, letterSpacing: "0.12em", cursor: "pointer", borderRadius: 2 }}>
            CHECKOUT — ${total.toFixed(2)}
          </button>
          <p style={{ color: CREAM, opacity: 0.35, fontFamily: "monospace", fontSize: 11, textAlign: "center", marginTop: 10 }}>Free shipping on orders over $120</p>
        </div>
      </div>
    </>
  );
}
 
function ProductModal({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (args: { product: Product; colorIdx: number; size: string }) => void }) {
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState(null);
  const [added, setAdded] = useState(false);
 
  function handleAdd() {
    if (!size) return;
    onAdd({ product, colorIdx, size });
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1200);
  }
 
  if (!product) return null;
  const cw = product.colorways[colorIdx];
 
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: "16px" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }} />
      <div style={{ position: "relative", background: MID, width: "min(860px, 95vw)", borderRadius: 4, display: "flex", overflow: "hidden", maxHeight: "90dvh", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ width: "42%", background: DARK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", flexShrink: 0 }}>
          <div style={{ position: "absolute", top: 16, left: 16, background: TERRACOTTA, color: DARK, fontFamily: "monospace", fontSize: 9, letterSpacing: "0.15em", padding: "4px 8px", fontWeight: 700 }}>{product.tag}</div>
          <div style={{ animation: "floatShirt 4s ease-in-out infinite" }}>
            <ShirtSVG product={product} colorIdx={colorIdx} size={260} />
          </div>
        </div>
        <div style={{ flex: 1, padding: "36px 32px", overflowY: "auto" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", color: CREAM, fontSize: 24, cursor: "pointer", opacity: 0.5 }}>×</button>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: CREAM, fontSize: 28, fontWeight: 900, margin: "0 0 4px" }}>{product.name}</h2>
          <div style={{ color: GOLD, fontFamily: "monospace", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>${product.price}</div>
          <p style={{ color: CREAM, opacity: 0.65, fontFamily: "monospace", fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>{product.description}</p>
          <div style={{ marginBottom: 24 }}>
            <div style={{ color: CREAM, opacity: 0.5, fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em", marginBottom: 10 }}>COLORWAY — {cw.label}</div>
            <div style={{ display: "flex", gap: 10 }}>
              {product.colorways.map((c, i) => (
                <button key={i} onClick={() => setColorIdx(i)} title={c.label} style={{ width: 32, height: 32, borderRadius: "50%", background: c.shirt, border: colorIdx === i ? `2px solid ${GOLD}` : "2px solid rgba(255,255,255,0.15)", cursor: "pointer", transition: "border 0.2s" }} />
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ color: CREAM, opacity: 0.5, fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em", marginBottom: 10 }}>SIZE {size ? `— ${size}` : ""}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {product.sizes.map(s => (
                <button key={s} onClick={() => setSize(s)} style={{ padding: "8px 14px", fontFamily: "monospace", fontSize: 12, background: size === s ? TERRACOTTA : "rgba(255,255,255,0.05)", color: size === s ? DARK : CREAM, border: `1px solid ${size === s ? TERRACOTTA : "rgba(255,255,255,0.15)"}`, cursor: "pointer", borderRadius: 2, transition: "all 0.2s" }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 28 }}>
            <div style={{ color: CREAM, opacity: 0.5, fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em", marginBottom: 10 }}>DETAILS</div>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {product.details.map((d, i) => (
                <li key={i} style={{ color: CREAM, opacity: 0.6, fontFamily: "monospace", fontSize: 12, marginBottom: 4 }}>{d}</li>
              ))}
            </ul>
          </div>
          <button onClick={handleAdd} disabled={!size} style={{ width: "100%", padding: "16px", background: added ? "#2D7D46" : !size ? "rgba(200,91,42,0.4)" : TERRACOTTA, border: "none", color: added ? "#fff" : DARK, fontFamily: "monospace", fontWeight: 700, fontSize: 13, letterSpacing: "0.12em", cursor: size ? "pointer" : "not-allowed", borderRadius: 2, transition: "background 0.3s" }}>
            {added ? "✓ ADDED TO CART" : `ADD TO CART — $${product.price}`}
          </button>
        </div>
      </div>
    </div>
  );
}
 
function ShareModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
 
  function copy() {
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }
 
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: "16px" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }} />
      <div style={{ position: "relative", background: MID, borderRadius: 4, width: "min(480px, 95vw)", padding: "40px 36px", border: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", color: CREAM, fontSize: 24, cursor: "pointer", opacity: 0.5 }}>×</button>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: CREAM, fontSize: 26, fontWeight: 900, margin: "0 0 24px" }}>Share the store</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <div style={{ flex: 1, background: DARK, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 2, padding: "12px 14px", color: CREAM, fontFamily: "monospace", fontSize: 12, opacity: 0.7, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{url}</div>
          <button onClick={copy} style={{ padding: "12px 18px", background: copied ? "#2D7D46" : TERRACOTTA, border: "none", color: copied ? "#fff" : DARK, fontFamily: "monospace", fontWeight: 700, fontSize: 12, cursor: "pointer", borderRadius: 2, transition: "background 0.3s", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{copied ? "✓ COPIED" : "COPY"}</button>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { label: "Twitter / X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}` },
            { label: "Instagram", href: "https://instagram.com" },
            { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(url)}` },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: "10px 0", textAlign: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: CREAM, fontFamily: "monospace", fontSize: 11, cursor: "pointer", borderRadius: 2, textDecoration: "none", letterSpacing: "0.08em" }}>{s.label}</a>
          ))}
        </div>
      </div>
    </div>
  );
}
 
export default function Store() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart-mcinyc");
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [filter, setFilter] = useState("ALL");
 
  useEffect(() => {
    try {
      localStorage.setItem("cart-mcinyc", JSON.stringify(cart));
    } catch (_) {}
  }, [cart]);
 
  function addToCart({ product, colorIdx, size }) {
    const cw = product.colorways[colorIdx];
    const cartId = `${product.id}-${colorIdx}-${size}-${Date.now()}`;
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id && i.colorIdx === colorIdx && i.size === size);
      if (existing) return prev.map(i => i.cartId === existing.cartId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { cartId, productId: product.id, name: product.name, price: product.price, colorIdx, colorLabel: cw.label, size, qty: 1 }];
    });
    setCartOpen(true);
  }
 
  const tags = ["ALL", ...new Set(PRODUCTS.map(p => p.tag))];
  const visible = filter === "ALL" ? PRODUCTS : PRODUCTS.filter(p => p.tag === filter);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
 
  return (
    <div style={{ background: DARK, minHeight: "100vh", color: CREAM }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${DARK}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${MID}; }
        ::-webkit-scrollbar-thumb { background: ${TERRACOTTA}; }
        @keyframes floatShirt { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes marqueeScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .product-card { transition: all 0.3s cubic-bezier(.22,1,.36,1); cursor: pointer; }
        .product-card:hover { box-shadow: 0 24px 48px rgba(0,0,0,0.35), 4px 4px 0 ${TERRACOTTA}; transform: translateY(-4px); }
        .product-card:hover .card-img { transform: translateY(-6px) scale(1.03); }
        .card-img { transition: transform 0.35s cubic-bezier(.22,1,.36,1); }
        .nav-link { opacity:0.5; transition:opacity 0.2s; text-decoration:none; color:${CREAM}; font-family:monospace; font-size:10px; letter-spacing:0.14em; }
        .nav-link:hover { opacity:1; }
        .filter-tab { font-family:monospace; font-size:10px; letter-spacing:0.12em; cursor:pointer; padding:6px 14px; border-radius:2px; transition:all 0.2s; border:1px solid rgba(255,255,255,0.15); background:transparent; color:${CREAM}; opacity:0.6; }
        .filter-tab.active { background:${TERRACOTTA}; border-color:${TERRACOTTA}; color:${DARK}; opacity:1; }
        .filter-tab:hover:not(.active) { opacity:1; }
      `}</style>
 
      <nav style={{ position:"sticky", top:0, height:64, zIndex:100, background:"rgba(15,14,11,0.85)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px" }}>
        <div style={{ fontFamily:"'Playfair Display', serif", fontStyle:"italic", color:TERRACOTTA, fontSize:14, fontWeight:700, lineHeight:1.3, whiteSpace:"pre-line" }}>{"My Culture Is Not\nYour Costume.™"}</div>
        <div style={{ display:"flex", gap:32 }}>
          <a href="#collection" className="nav-link">Collection</a>
          <a href="#mission" className="nav-link">Mission</a>
          <a href="#stockists" className="nav-link">Stockists</a>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => setShareOpen(true)} style={{ padding:"8px 16px", background:"none", border:"1px solid rgba(255,255,255,0.25)", color:CREAM, fontFamily:"monospace", fontSize:10, letterSpacing:"0.12em", cursor:"pointer", borderRadius:2 }}>↗ SHARE</button>
          <button onClick={() => setCartOpen(true)} style={{ padding:"8px 16px", background:TERRACOTTA, border:"none", color:DARK, fontFamily:"monospace", fontSize:10, fontWeight:700, letterSpacing:"0.12em", cursor:"pointer", borderRadius:2 }}>CART ({cartCount})</button>
        </div>
      </nav>
 
      <div style={{ background:TERRACOTTA, overflow:"hidden", height:36, display:"flex", alignItems:"center" }}>
        <div style={{ display:"flex", whiteSpace:"nowrap", animation:"marqueeScroll 24s linear infinite" }}>
          {Array(8).fill("MY CULTURE IS NOT YOUR COSTUME · HERITAGE IS NOT A TREND · WEAR WHAT IS YOURS · RECLAIM · ").map((t, i) => (
            <span key={i} style={{ fontFamily:"monospace", fontSize:11, color:DARK, letterSpacing:"0.12em" }}>{t}</span>
          ))}
        </div>
      </div>
 
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"80px 32px 64px", display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:48, alignItems:"center" }}>
        <div style={{ animation:"fadeUp 0.8s ease both" }}>
          <div style={{ fontFamily:"monospace", fontSize:10, letterSpacing:"0.2em", color:TERRACOTTA, marginBottom:20, opacity:0.85 }}>SS 2025 · DROP 01 — RECLAIM</div>
          <h1 style={{ fontFamily:"'Playfair Display', serif", fontWeight:900, fontSize:"clamp(42px, 6vw, 72px)", lineHeight:1.08, color:CREAM, marginBottom:24 }}>
            Wear What<br /><em style={{ color:TERRACOTTA }}>Is Yours.</em>
          </h1>
          <p style={{ fontFamily:"monospace", fontSize:13, lineHeight:1.8, color:CREAM, opacity:0.65, maxWidth:440, marginBottom:36 }}>
            Fashion built from pride, not appropriation. Every piece honors communities whose traditions have been commodified. 15% of net profits go to cultural preservation orgs.
          </p>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            <a href="#collection" style={{ padding:"14px 28px", background:TERRACOTTA, color:DARK, fontFamily:"monospace", fontWeight:700, fontSize:12, letterSpacing:"0.12em", textDecoration:"none", borderRadius:2, display:"inline-block" }}>SHOP THE DROP</a>
            <button onClick={() => setShareOpen(true)} style={{ padding:"14px 28px", background:"none", border:"1px solid rgba(255,255,255,0.25)", color:CREAM, fontFamily:"monospace", fontSize:12, letterSpacing:"0.12em", cursor:"pointer", borderRadius:2 }}>↗ SHARE STORE</button>
          </div>
        </div>
        <div style={{ animation:"fadeUp 0.9s ease 0.15s both" }}>
          <div style={{ background:MID, borderRadius:8, padding:"40px 24px", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", minHeight:380, border:"1px solid rgba(255,255,255,0.06)" }}>
            <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.15 }}>
              <defs><pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill={CREAM} /></pattern></defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
            <div style={{ animation:"floatShirt 4s ease-in-out infinite", position:"relative", zIndex:1 }}>
              <ShirtSVG product={PRODUCTS[0]} colorIdx={0} size={280} />
            </div>
            <div style={{ position:"absolute", bottom:20, right:20, background:GOLD, color:DARK, padding:"12px 16px", borderRadius:4, fontFamily:"monospace", textAlign:"center", zIndex:2 }}>
              <div style={{ fontSize:22, fontWeight:700, lineHeight:1 }}>15%</div>
              <div style={{ fontSize:9, letterSpacing:"0.1em", marginTop:4, opacity:0.8 }}>PROFITS TO<br/>CULTURAL ORGS</div>
            </div>
          </div>
        </div>
      </section>
 
      <section id="collection" style={{ maxWidth:1200, margin:"0 auto", padding:"64px 32px" }}>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:40, flexWrap:"wrap", gap:20 }}>
          <div>
            <div style={{ fontFamily:"monospace", fontSize:10, letterSpacing:"0.2em", color:TERRACOTTA, marginBottom:10 }}>THE COLLECTION</div>
            <h2 style={{ fontFamily:"'Playfair Display', serif", fontWeight:900, fontSize:"clamp(28px, 4vw, 42px)", color:CREAM }}>Drop 01 — <em>Reclaim</em></h2>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {tags.map(t => (
              <button key={t} className={`filter-tab${filter === t ? " active" : ""}`} onClick={() => setFilter(t)}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(310px, 1fr))", gap:20 }}>
          {visible.map((product, index) => {
            const cw = product.colorways[0];
            return (
              <div key={product.id} className="product-card" onClick={() => setModal(product)} style={{ background:cw.shirt, borderRadius:6, padding:"24px", overflow:"hidden", position:"relative", animation:`fadeUp 0.5s ease ${index * 0.07}s both` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                  <span style={{ background:"rgba(0,0,0,0.4)", color:CREAM, fontFamily:"monospace", fontSize:8, letterSpacing:"0.15em", padding:"4px 8px", borderRadius:2 }}>{product.tag}</span>
                  <span style={{ color:cw.text, fontFamily:"monospace", fontSize:10, opacity:0.7 }}>{product.colorways.length} colorways</span>
                </div>
                <div className="card-img" style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
                  <ShirtSVG product={product} colorIdx={0} size={210} />
                </div>
                <h3 style={{ fontFamily:"'Playfair Display', serif", fontWeight:700, fontSize:18, color:cw.text, marginBottom:6 }}>{product.name}</h3>
                <p style={{ fontFamily:"monospace", fontSize:11, color:cw.text, opacity:0.65, lineHeight:1.6, marginBottom:16, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{product.description}</p>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontFamily:"monospace", fontSize:18, fontWeight:700, color:cw.text }}>${product.price}</span>
                  <span style={{ background:"rgba(0,0,0,0.35)", color:cw.text, fontFamily:"monospace", fontSize:10, letterSpacing:"0.12em", padding:"6px 12px", borderRadius:2, fontWeight:700 }}>QUICK ADD +</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
 
      <section id="mission" style={{ background:TERRACOTTA, padding:"80px 32px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
          <div>
            <h2 style={{ fontFamily:"'Playfair Display', serif", fontWeight:900, fontSize:"clamp(28px, 4vw, 44px)", color:DARK, lineHeight:1.2, marginBottom:20 }}>Fashion has always stolen.<br /><em>We take it back.</em></h2>
            <p style={{ fontFamily:"monospace", fontSize:13, lineHeight:1.9, color:DARK, opacity:0.75 }}>Every piece in this collection was designed in collaboration with community members. We don't take inspiration — we build together. 15% of every sale funds organizations working to preserve, restore, and celebrate the cultures that have been exploited for profit.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {[["Community-led","Designed with, not from."],["Living wages","Every hand in the supply chain."],["No appropriation","Culture is not a costume."],["Profit sharing","15% to preservation orgs."]].map(([title, body]) => (
              <div key={title} style={{ background:"rgba(0,0,0,0.2)", borderRadius:6, padding:"24px 20px" }}>
                <div style={{ fontFamily:"'Playfair Display', serif", fontWeight:700, fontSize:16, color:DARK, marginBottom:8 }}>{title}</div>
                <div style={{ fontFamily:"monospace", fontSize:11, color:DARK, opacity:0.7, lineHeight:1.6 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      <footer id="stockists" style={{ borderTop:"1px solid rgba(255,255,255,0.08)", padding:"40px 32px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:20 }}>
          <div style={{ fontFamily:"'Playfair Display', serif", fontStyle:"italic", color:TERRACOTTA, fontSize:16, fontWeight:700 }}>My Culture Is Not Your Costume.™</div>
          <div style={{ fontFamily:"monospace", fontSize:10, color:CREAM, opacity:0.4 }}>© 2025 MCINYC. All rights reserved.</div>
          <div style={{ display:"flex", gap:20 }}>
            {["IG","TW","TK","EMAIL"].map(s => (
              <span key={s} style={{ fontFamily:"monospace", fontSize:10, letterSpacing:"0.12em", color:CREAM, opacity:0.5, cursor:"pointer" }}>{s}</span>
            ))}
          </div>
        </div>
      </footer>
 
      <CartDrawer cart={cart} setCart={setCart} open={cartOpen} onClose={() => setCartOpen(false)} />
      {modal && <ProductModal product={modal} onClose={() => setModal(null)} onAdd={addToCart} />}
      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
    </div>
  );
}