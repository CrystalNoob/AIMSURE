import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
// import { BusinessProfileData } from "@/app/results/page";

export type BusinessProfileData = {
  business_name: string;
  background: string;
  industry: string;
  key_activities: string;
};
const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", padding: 30 },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Helvetica-Bold",
  },
  section: { marginBottom: 10 },
  heading: { fontSize: 14, marginBottom: 5, fontFamily: "Helvetica-Bold" },
  text: { fontSize: 11 },
});

export const BusinessProfilePDF = ({ data }: { data: BusinessProfileData }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>{data.business_name} - Business Profile</Text>
      <View style={styles.section}>
        <Text style={styles.heading}>Industry</Text>
        <Text style={styles.text}>{data.industry}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Company Background</Text>
        <Text style={styles.text}>{data.background}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Key Activities</Text>
        <Text style={styles.text}>{data.key_activities}</Text>
      </View>
    </Page>
  </Document>
);
