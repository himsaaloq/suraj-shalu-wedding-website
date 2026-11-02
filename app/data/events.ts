export type WeddingEvent = {
  day: string;
  month: string;
  weekday: string;
  title: string;
  time: string;
  venue: string;
  city: string;
  icon: string;
  description: string;
  category: "pre" | "wedding";
};

export const events: WeddingEvent[] = [
  { day: "05", month: "दिसंबर", weekday: "शनिवार", title: "लग्न / विनायक", time: "दोपहर 3:00 बजे", venue: "निवास स्थान", city: "भीलवाड़ा", icon: "🪔", description: "श्री गणेश पूजन एवं शुभ लग्न की मंगल शुरुआत।", category: "pre" },
  { day: "10", month: "दिसंबर", weekday: "गुरुवार", title: "हल्दी", time: "दोपहर 12:00 बजे", venue: "सामुदायिक भवन", city: "भीलवाड़ा", icon: "🌼", description: "हल्दी, हँसी और अपनों के संग खुशियों के रंग।", category: "pre" },
  { day: "10", month: "दिसंबर", weekday: "गुरुवार", title: "मायरा", time: "दोपहर 2:00 बजे", venue: "सामुदायिक भवन", city: "भीलवाड़ा", icon: "🎁", description: "परिवार की परंपराओं और स्नेह का पावन अवसर।", category: "pre" },
  { day: "10", month: "दिसंबर", weekday: "गुरुवार", title: "मंगल कलश", time: "शाम 4:00 बजे", venue: "निवास स्थान", city: "भीलवाड़ा", icon: "🏺", description: "मंगल कलश के साथ शुभता और समृद्धि का स्वागत।", category: "pre" },
  { day: "10", month: "दिसंबर", weekday: "गुरुवार", title: "प्रीति भोज", time: "शाम 7:30 बजे से", venue: "सामुदायिक भवन", city: "भीलवाड़ा", icon: "🍽️", description: "स्नेहभोज में पधारकर नवयुगल को आशीर्वाद दें।", category: "pre" },
  { day: "11", month: "दिसंबर", weekday: "शुक्रवार", title: "बारात प्रस्थान", time: "प्रात 8:00 बजे", venue: "निवास स्थान", city: "भीलवाड़ा", icon: "🐎", description: "शुभ विवाह की ओर मंगलमय बारात प्रस्थान।", category: "wedding" },
  { day: "11", month: "दिसंबर", weekday: "शुक्रवार", title: "फेरे / परिणय संस्कार", time: "रात्रि में शुभ लग्न अनुसार", venue: "विवाह स्थल", city: "चित्तौड़गढ़", icon: "💍", description: "अग्नि को साक्षी मानकर सात फेरों का पवित्र बंधन।", category: "wedding" },
];
