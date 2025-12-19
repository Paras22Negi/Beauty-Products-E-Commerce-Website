// Achivement.jsx
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import React from "react";

// Background triangle image
const TriangleImg = styled("img")(() => ({
  position: "absolute",
  right: -5,
  bottom: -5,
  height: 130,
  opacity: 0.15,
  pointerEvents: "none",
  zIndex: 0,
}));

// Trophy image
const TrophyImg = styled("img")(() => ({
  position: "absolute",
  right: 12,
  bottom: 20,
  height: 85,
  opacity: 1,
  pointerEvents: "none",
  zIndex: 0,
}));

const Achivement = ({ sales }) => {
  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        backgroundColor: "#18181b", // Zinc-900
        color: "#fff", // White Text
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "none",
        "&:hover": { border: "1px solid rgba(255,255,255,0.1)" },
      }}
    >
      <CardContent sx={{ position: "relative", zIndex: 2, p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
          Venus Garments
        </Typography>

        <Typography variant="body2" sx={{ mb: 1, color: "#9ca3af" }}>
          {" "}
          {/* Gray-400 */}
          Congratulations 🥳
        </Typography>

        <Typography
          variant="h5"
          sx={{
            my: 2.5,
            fontWeight: 900,
            color: "#818cf8", // Indigo-400
          }}
        >
          {sales ? `${sales.toLocaleString()} INR` : "Loading..."}
        </Typography>

        <Button
          size="small"
          variant="contained"
          sx={{
            textTransform: "none",
            bgcolor: "#4f46e5",
            "&:hover": { bgcolor: "#4338ca" },
          }}
        >
          View Sales
        </Button>
      </CardContent>

      {/* Decorative images */}
      <TriangleImg
        alt="triangle background"
        src={`/images/misc/triangle-light.png`}
      />
      <TrophyImg alt="trophy" src="/images/misc/trophy.png" />
    </Card>
  );
};

export default Achivement;
