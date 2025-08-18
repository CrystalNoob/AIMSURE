// import React from "react";
// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   Font,
//   Image,
// } from "@react-pdf/renderer";

// export type BusinessProfileData = {
//   business_name: string;
//   background: string;
//   industry: string;
//   key_activities: string;
// };

// Font.register({
//   family: "Montserrat",
//   fonts: [
//     { src: "/fonts/Montserrat-Regular.ttf" },
//     { src: "/fonts/Montserrat-Bold.ttf", fontWeight: "bold" },
//   ],
// });
// Font.register({
//   family: "Lato",
//   src: "/fonts/Lato-Regular.ttf",
// });

// const styles = StyleSheet.create({
//   page: {
//     fontFamily: "Lato",
//     fontSize: 11,
//     paddingTop: 60,
//     paddingLeft: 40,
//     paddingRight: 40,
//     paddingBottom: 40,
//     lineHeight: 1.5,
//     color: "#333333",
//   },
//   header: {
//     position: "absolute",
//     top: 20,
//     left: 40,
//     right: 40,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderBottomColor: "#eeeeee",
//     paddingBottom: 5,
//   },
//   logo: {
//     width: 90,
//     height: 24,
//   },
//   headerText: {
//     fontFamily: "Montserrat",
//     fontSize: 10,
//     color: "#666666",
//   },
//   pageNumber: {
//     position: "absolute",
//     fontSize: 10,
//     bottom: 20,
//     left: 0,
//     right: 0,
//     textAlign: "center",
//     color: "grey",
//   },
//   title: {
//     fontFamily: "Montserrat",
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 25,
//     color: "#2D336B",
//   },
//   section: {
//     marginBottom: 20,
//   },
//   heading: {
//     fontFamily: "Montserrat",
//     fontSize: 14,
//     fontWeight: "bold",
//     marginBottom: 8,
//     color: "#2D336B",
//     borderBottomWidth: 1,
//     borderBottomColor: "#eeeeee",
//     paddingBottom: 3,
//   },
//   text: {
//     textAlign: "justify",
//   },
// });

// export const BusinessProfilePDF = ({ data }: { data: BusinessProfileData }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.header} fixed>
//         {/* eslint-disable-next-line jsx-a11y/alt-text */}
//         <Image style={styles.logo} src="/logo/Logo AIMSure 2.png" />
//         <Text style={styles.headerText}>Business Profile</Text>
//       </View>

//       <Text style={styles.title}>{data.business_name}</Text>

//       <View style={styles.section}>
//         <Text style={styles.heading}>Industry</Text>
//         <Text style={styles.text}>{data.industry}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.heading}>Company Background</Text>
//         <Text style={styles.text}>{data.background}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.heading}>Key Activities & Services</Text>
//         <Text style={styles.text}>{data.key_activities}</Text>
//       </View>

//       <Text
//         style={styles.pageNumber}
//         render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
//         fixed
//       />
//     </Page>
//   </Document>
// );

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
