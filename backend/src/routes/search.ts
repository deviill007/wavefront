import { Router, Request, Response } from "express";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const router = Router();

// GET /api/search?q=shape+of+you
router.get("/", async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query) {
    res.status(400).json({ error: "Query parameter q is required" });
    return;
  }

  try {
    console.log(`Searching for: ${query}`);

    const { stdout } = await execAsync(
      `yt-dlp "ytsearch10:${query}" --print "%(id)s||%(title)s||%(uploader)s||%(duration)s||%(thumbnail)s" --no-playlist --flat-playlist`,
      { timeout: 20000 },
    );

    const lines = stdout.trim().split("\n").filter(Boolean);
    const results = lines.map((line) => {
      const [id, title, artist, duration] = line.split("||");
      return {
        id,
        title,
        artist,
        duration: parseInt(duration) || 0,
        // YouTube thumbnail URL is always this format — no API needed!
        thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
      };
    });

    res.json({ success: true, data: results });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
