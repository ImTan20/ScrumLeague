export const positions = [
    "Full Back (1)", "Right Wing (2)", "Right Centre (3)", "Left Centre (4)", "Left Wing (5)",
    "Stand Off (6)", "Scrum Half(7)", "Prop (8)", "Hooker (9)", "Prop (10)",
    "Second Row (11)", "Second Row (12)", "Loose Forward (13)","Interchange (14)", "Interchange (15)", "Interchange (16)", "Interchange (17)" 
  ];
// Separate lists
export const interchangePositions = positions.filter(position => position.includes("Interchange"));
export const starterPositions = positions.filter(position => !position.includes("Interchange"));