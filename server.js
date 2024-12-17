const express = require('express');
const dbUtility = require('./dbUtility.js');
const getAddress = require('./Utilitys.js');
const { OperationEnums }  = require('./utilityEnum.js'); 
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const cors = require("cors");
app.use(cors());
const port = process.env.PORT || 3010;
const router = express.Router();
app.use(express.json());

// Setup Swagger documentation

const swaggerComponents = require('./SwaggerComponents.js');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rollcallpwa  std API',
      version: '1.0.0',
      description: 'RollCall standard database APIs',
    },
    components: swaggerComponents
  },
  apis: ['./server.js'], // Path to the API docs
  //apis: [path.resolve(__dirname, './latestads.js')], // Reference to the current file
  //apis: [path.resolve(__dirname, './services/LatestAds/*.js')], // Use absolute path
};

const swaggerSpec = swaggerJsdoc(options);
//console.log(JSON.stringify(swaggerSpec, null, 2)); 
app.use('/authapi-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//const serveSwaggerAdmin = swaggerUi.serveFiles(AdminswaggerSpec, {});
//const serveSwaggerlatestads = swaggerUi.serveFiles(latestadswaggerSpec, {});
//app.use('/Adminapi-docs', serveSwaggerAdmin, swaggerUi.setup(AdminswaggerSpec));
//app.use('/latestadsapi-docs', serveSwaggerlatestads, swaggerUi.setup(latestadswaggerSpec));


app.use('/std', router); 


// Common function to handle executing stored procedures
const executeStoredProcedure = (req, res, data, operationId) => {
    const jsonData = JSON.stringify(data);
    const sqlQuery = `
        DECLARE @ResultMessage NVARCHAR(MAX);
        DECLARE @STATUS NVARCHAR(MAX); 
        EXEC prod.[SP_ScreenOperations]
            @OperationId = '${operationId}',
            @JsonData = '${jsonData}',
            @ResultMessage = @ResultMessage OUTPUT,
            @STATUS = @STATUS OUTPUT; 
        SELECT @ResultMessage AS ResultMessage, @STATUS AS Status; 
    `;

    console.log(sqlQuery);
    dbUtility.executeQuery(sqlQuery)
        .then(results => handleResponse(res, null, results))
        .catch(error => handleResponse(res, error, null));
};


const handleResponse = (res, error, results) => {
    if (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } else if (results && results.length > 0) {
        res.json({ ResultData: results, Status: true });
    } else {
        res.status(200).json({ error: 'No records found', Status: false });
    }
};

const handleRecord = (req, res, data, operationId) => {
    //const data = req.method === 'GET' ? req.query : req.body;
    //processJsonData(data);
    const responseData = executeStoredProcedure(req, res, data, operationId);
    return responseData
};

const abc = () => {
    const responseData = {
        message: 'Hello, World!',
        status: true,
        data: [1, 2, 3, 4, 5]
    };
    return responseData
};

app.get('/getData', (req, res) => {
    const responseData = abc();
    console.log(responseData)

    // Send JSON response
    res.json(responseData);
});


function PostCommonCode(req, res, operation) {
    try {
        const Data = req.body; 
        handleRecord(req, res, Data, operation);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: `Error processing ${operation}` });
    }
}

// Define the GET API
router.get('/', (req, res) => {
    res.send("It's working");
});


router.get('/getPunchType', (req, res)=>{
    const data = req.query;
    handleRecord(req, res, data, OperationEnums().getPunchType);
});




router.post('/login', (req, res)=>{
    const Data = req.body;
    const inputdata = Data.inputdata;
    console.log(inputdata)
    handleRecord(req, res, inputdata, OperationEnums().SignIn);
});

router.post('/changepassword', (req, res)=>{
    const Data = req.body;
    const inputdata = Data.inputdata;
    console.log(inputdata)
    handleRecord(req, res, inputdata, OperationEnums().changepassword);
});

router.get('/getleavetype', (req, res)=>{
    const superid = req.query;
    console.log(superid)
    handleRecord(req, res, superid, OperationEnums().getleavetype);
});

router.get('/getempleaves', (req, res)=>{
    // Extract query parameters with default values
    const regid = parseInt(req.query.regid) || 0;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    
    // Construct start and end dates
    const stardate = `${year}-01-01`;
    const enddate = `${year}-12-31`;

    // Create the response object
    const data_d = {
        regid: regid,
        year: year,
        StartDt: stardate,
        EndDt: enddate
    };

    handleRecord(req, res, data_d, OperationEnums().getempleaves);
});


router.post('/saveleave', (req, res)=>{
    const Data = req.body;
    const inputdata = Data.inputdata;
    console.log(inputdata)
    handleRecord(req, res, inputdata, OperationEnums().saveleave);
});


router.get('/getemplast7daysattendance', (req, res)=>{
        const todate = new Date();

        // Calculate the date 10 days ago
        const fromdate = new Date();
        fromdate.setDate(todate.getDate() - 10);

        // Retrieve query parameters with default values
        const regid = parseInt(req.query.regid) || 0;
        const superid = parseInt(req.query.superid) || 0;

        // Format the dates (optional, ISO format is widely accepted)
        const formattedToDate = todate.toISOString().split('T')[0];
        const formattedFromDate = fromdate.toISOString().split('T')[0];

        // Create the response object
        const inputdata = {
            regid: regid,
            superid: superid,
            todate: formattedToDate,
            fromdate: formattedFromDate
        };
        // const inputdata = {
        //     regid: regid,
        //     superid: superid,
        //     todate: "2023-12-30",
        //     fromdate: "2023-12-06"
        // };
        // console.log(inputdata)
    handleRecord(req, res, inputdata, OperationEnums().getemplast7daysattendance);
});


router.get('/getempattendance', (req, res)=>{
    // Get query parameters
    const regid = parseInt(req.query.regid) || 0;
    const superid = parseInt(req.query.superid) || 0;
    const month = parseInt(req.query.month) || new Date().getMonth() + 1; // Months are 0-based in JS
    const year = parseInt(req.query.year) || new Date().getFullYear();

    // Calculate the first and last day of the given month
    const firstDayOfMonth = new Date(year, month - 1, 1); // Month is 0-indexed
    const lastDayOfMonth = new Date(year, month, 0); // Setting day as 0 gives the last day of the previous month

    // Response data
    const inputdata = {
        regid,
        superid,
        month,
        year,
        fromdate: firstDayOfMonth.toISOString().split("T")[0], // Format as YYYY-MM-DD
        todate: lastDayOfMonth.toISOString().split("T")[0],   // Format as YYYY-MM-DD
    };
    
    handleRecord(req, res, inputdata, OperationEnums().getempattendance);
});

router.post('/writeswipe', (req, res)=>{
    const Data = req.body;
    const inputdata = Data.inputdata;
    console.log(inputdata)
    handleRecord(req, res, inputdata, OperationEnums().writeswipe);
});

router.get('/getempprofile', (req, res)=>{
    const regid = req.query;
    console.log(regid)
    handleRecord(req, res, regid, OperationEnums().getempprofile);
});


app.listen(port, () => {
    console.log(`Authentication services running on port ${port}`);
});