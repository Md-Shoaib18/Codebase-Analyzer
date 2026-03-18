export const analyzeRepo = async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: "Repo URL is required" });
    }

    res.json({ message: "Analysis started" });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};