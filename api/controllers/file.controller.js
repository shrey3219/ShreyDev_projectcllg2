import File from'../models/file.js'


export const getfiles = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
      const files = await File.find({
        ...(req.query.uuid && { uuid: req.query.uuid }),
        ...(req.query.filename && { filename: req.query.filename }),
        
        
      })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      const totalFiles = await File.countDocuments();
  
      const now = new Date();
  
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
  
      const lastMonthFiles = await File.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
  
      res.status(200).json({
        files,
        totalFiles,
        lastMonthFiles,
      });
    } catch (error) {
      next(error);
    }
  };