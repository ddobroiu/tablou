import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/siteConfig";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToStream,
} from "@react-pdf/renderer";
import { Readable } from "stream";

export const runtime = 'nodejs';

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#334155",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#1e293b",
    paddingBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10b981",
    textTransform: "uppercase",
  },
  offerTitleBlock: {
    alignItems: "flex-end",
  },
  offerTitle: {
    fontSize: 20,
    color: "#1e293b",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  offerSubtitle: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 4,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 30,
    justifyContent: "space-between",
  },
  infoColumn: {
    width: "48%",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#cbd5e1",
  },
  infoColumnActive: {
    borderLeftColor: "#10b981",
  },
  infoLabel: {
    fontSize: 8,
    color: "#94a3b8",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 10,
    color: "#1e293b",
    marginBottom: 2,
  },
  infoValueBold: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  table: {
    width: "auto",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    minHeight: 24,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#1e293b",
  },
  tableHeaderCell: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "bold",
    padding: 8,
    textTransform: "uppercase",
  },
  tableCell: {
    padding: 8,
    fontSize: 9,
    color: "#334155",
  },
  col1: { width: "5%", textAlign: "center" },
  col2: { width: "45%", textAlign: "left" },
  col3: { width: "20%", textAlign: "center" },
  col4: { width: "15%", textAlign: "right" },
  col5: { width: "15%", textAlign: "right" },
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 30,
  },
  totalsBox: {
    width: "40%",
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 4,
  },
  totalRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 2,
    borderTopColor: "#1e293b",
  },
  finalTotalLabel: { fontSize: 12, fontWeight: "bold", color: "#1e293b" },
  finalTotalValue: { fontSize: 14, fontWeight: "bold", color: "#10b981" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
    marginBottom: 2,
  },
});

const formatCurrency = (amount: any) => {
  return new Intl.NumberFormat("ro-RO", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + " RON";
};

export const OfferDocument = ({ order, siteInfo }: any) => {
  const createdDate = new Date(order.createdAt).toLocaleDateString("ro-RO");
  const validUntilDate = new Date();
  validUntilDate.setDate(validUntilDate.getDate() + 30);

  const clientName = order.billing?.name || "Client Site";
  const items = order.items || [];
  const grandTotal = Number(order.total) || 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View><Text style={styles.logoText}>{siteInfo.name?.toUpperCase()}</Text></View>
          <View style={styles.offerTitleBlock}>
            <Text style={styles.offerTitle}>OFERTA DE PRET</Text>
            <Text style={styles.offerSubtitle}>Data: {createdDate}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>FURNIZOR:</Text>
            <Text style={styles.infoValueBold}>{siteInfo.name}</Text>
            <Text style={styles.infoValue}>Email: {siteInfo.email}</Text>
            <Text style={styles.infoValue}>Tel: {siteInfo.phone}</Text>
          </View>
          <View style={[styles.infoColumn, styles.infoColumnActive]}>
            <Text style={styles.infoLabel}>BENEFICIAR:</Text>
            <Text style={styles.infoValueBold}>{clientName}</Text>
            <Text style={styles.infoValue}>Document generat din configurator online.</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>#</Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>Produs</Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>Cant.</Text>
            <Text style={[styles.tableHeaderCell, styles.col4]}>Pret Unit.</Text>
            <Text style={[styles.tableHeaderCell, styles.col5]}>Total</Text>
          </View>
          {items.map((item: any, index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>{index + 1}</Text>
              <Text style={[styles.tableCell, styles.col2]}>{item.name}</Text>
              <Text style={[styles.tableCell, styles.col3]}>{item.qty} buc</Text>
              <Text style={[styles.tableCell, styles.col4]}>{formatCurrency(Number(item.unit))}</Text>
              <Text style={[styles.tableCell, styles.col5]}>{formatCurrency(Number(item.total))}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRowFinal}>
              <Text style={styles.finalTotalLabel}>TOTAL:</Text>
              <Text style={styles.finalTotalValue}>{formatCurrency(grandTotal)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Oferta valabila pana la {validUntilDate.toLocaleDateString("ro-RO")}.</Text>
          <Text style={styles.footerText}>Generat automat de platforma {siteInfo.url}.</Text>
        </View>
      </Page>
    </Document>
  );
};

export async function POST(req: any) {
  try {
    const body = await req.json();
    const { items, shipping }: any = body;

    const now = new Date();
    const cleanItems = (items || []).map((it: any) => ({
      name: String(it.name || it.title || it.slug || 'Produs Personalizat'),
      qty: parseInt(String(it.quantity || it.qty || 1), 10) || 1,
      unit: parseFloat(String(it.unitAmount || it.price || 0)) || 0,
      total: parseFloat(String(it.totalAmount || (Number(it.price || it.unitAmount) * Number(it.quantity || it.qty || 1)) || 0)) || 0,
    }));

    const order = {
      createdAt: now.toISOString(),
      billing: { name: "Specificația Dvs." },
      items: cleanItems,
      total: cleanItems.reduce((acc: number, it: any) => acc + it.total, 0) + (Number(shipping) || 0),
    };

    const siteClean = {
      name: String(siteConfig.name || "PRINT"),
      email: String(siteConfig.email || ""),
      phone: String(siteConfig.phone || ""),
      url: String(siteConfig.url || "")
    };

    const nodeStream = await renderToStream(<OfferDocument order={order} siteInfo={siteClean} />);
    
    // -- Robust stream to buffer conversion --
    const chunks: any[] = [];
    for await (const chunk of nodeStream) {
      chunks.push(chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="oferta-' + siteClean.name.toLowerCase() + '.pdf"',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('PDF Error:', error);
    return NextResponse.json({ error: 'Eroare la generarea PDF-ului.', details: error.message }, { status: 500 });
  }
}
