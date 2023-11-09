const express = require('express');
const userRouter= require('./routes/user.routes');

const PORT = process.env.PORT || 3000;


const app = express();
app.enable('trust proxy');

app.use(express.json())
app.use("/auth",userRouter);

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});
