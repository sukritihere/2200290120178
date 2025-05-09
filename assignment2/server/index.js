import express from "express";
import cors from "cors";
import { fetchNumbers, calculateAverage } from "./services/numberService.js";

const app = express();
const PORT = process.env.PORT || 9876;

app.use(cors());
app.use(express.json());

const WINDOW_SIZE = 10;
let numberWindow = [];

app.get("/numbers/:numberid", async (req, res) => {
  try {
    const { numberid } = req.params;

    if (!["p", "f", "e", "r"].includes(numberid)) {
      return res
        .status(400)
        .json({
          error:
            "Invalid number type. Use p (prime), f (fibonacci), e (even), or r (random)",
        });
    }

    const windowPrevState = [...numberWindow];

    const fetchedNumbers = await fetchNumbers(numberid);

    if (!fetchedNumbers || !Array.isArray(fetchedNumbers)) {
      return res
        .status(500)
        .json({ error: "Failed to fetch numbers from the third-party server" });
    }

    const uniqueNewNumbers = fetchedNumbers.filter(
      (num) => !numberWindow.includes(num)
    );

    if (uniqueNewNumbers.length > 0) {
      for (const num of uniqueNewNumbers) {
        if (numberWindow.length >= WINDOW_SIZE) {
          numberWindow.shift();
        }

        numberWindow.push(num);
      }
    }

    const avg = calculateAverage(numberWindow);

    const response = {
      windowPrevState,
      windowCurrState: [...numberWindow],
      numbers: fetchedNumbers,
      avg: avg.toFixed(2),
    };

    return res.json(response);
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
