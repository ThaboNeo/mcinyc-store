import crypto from "crypto";

export type PayFastFields = Record<string, string>;

function getConfig() {
  const merchantId = process.env.PAYFAST_MERCHANT_ID;
  return {
    merchantId: merchantId ?? "10004002", // PayFast sandbox default
    merchantKey: process.env.PAYFAST_MERCHANT_KEY ?? "q1cd2rdny4a53",
    passphrase: process.env.PAYFAST_PASSPHRASE,
    sandbox: !merchantId,
  };
}

export function getPayFastUrl(): string {
  const { sandbox } = getConfig();
  return sandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";
}

export function buildSignature(fields: PayFastFields): string {
  const { passphrase } = getConfig();
  const qs = Object.entries(fields)
    .filter(([, v]) => v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, "+")}`)
    .join("&");
  const toHash = passphrase
    ? `${qs}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`
    : qs;
  return crypto.createHash("md5").update(toHash).digest("hex");
}

export function buildPaymentFields({
  paymentId,
  totalRands,
  itemName,
  returnUrl,
  cancelUrl,
  notifyUrl,
}: {
  paymentId: string;
  totalRands: number;
  itemName: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
}): { fields: PayFastFields; payfastUrl: string } {
  const { merchantId, merchantKey } = getConfig();
  const fields: PayFastFields = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    m_payment_id: paymentId,
    amount: totalRands.toFixed(2),
    item_name: itemName.slice(0, 100),
  };
  fields.signature = buildSignature(fields);
  return { fields, payfastUrl: getPayFastUrl() };
}

export async function verifyITN(rawFields: PayFastFields): Promise<boolean> {
  // 1. Validate signature
  const { signature, ...rest } = rawFields;
  const expected = buildSignature(rest);
  if (signature !== expected) return false;

  // 2. Confirm with PayFast server (mandatory step per PayFast docs)
  const { sandbox } = getConfig();
  const host = sandbox ? "sandbox.payfast.co.za" : "www.payfast.co.za";
  const body = Object.entries(rawFields)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  try {
    const res = await fetch(`https://${host}/eng/query/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    return (await res.text()).trim() === "VALID";
  } catch {
    return false;
  }
}
