const searchService = require("../services/searchService");

exports.searchHouseholdsByHouseholdId = async (req, res) => {
  try {
    const { input } = req.query;

    if (!input || input.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search input parameter is required",
      });
    }

    const households = await searchService.searchHouseholdsByHouseholdId(
      input.trim()
    );

    res.status(200).json({
      success: true,
      data: households,
    });
  } catch (error) {
    console.error("Error searching households:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.searchHouseholdsByOwnerId = async (req, res) => {
  try {
    const { input } = req.query;

    if (!input || input.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search input parameter is required",
      });
    }

    const households = await searchService.searchHouseholdsByOwnerId(
      input.trim()
    );

    res.status(200).json({
      success: true,
      data: households,
    });
  } catch (error) {
    console.error("Error searching households:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.searchHouseholdsByHouseholdName = async (req, res) => {
  try {
    const { input } = req.query;

    if (!input || input.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search input parameter is required",
      });
    }

    const households = await searchService.searchHouseholdsByHouseholdName(
      input.trim()
    );

    res.status(200).json({
      success: true,
      data: households,
    });
  } catch (error) {
    console.error("Error searching households:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
