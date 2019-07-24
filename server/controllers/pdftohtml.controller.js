

exports.sendDoc = function (req, res) {
    console.log("TCL: exports.sendDoc -> req", req.body)
    try {
        if(req.body && req.files){
            console.log("TCL: req", req.body);
            console.log("TCL: exports.sendDoc -> req.files", req.files)
            return res.status(200).json({
                status: false,
                message: 'body got',
                details: 'done',
            });
        }
    } catch (err) {
      console.log("TCL: err", err)
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        details: err,
      });
    }
}  