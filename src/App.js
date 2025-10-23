import logo from './logo.svg';
import './App.css';
import {createTheme,ThemeProvider} from "@mui/material/styles";
import { useState } from 'react';

//** */
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';
import axios from 'axios';
import moment from 'moment';
import "moment/min/locales";

import TextField from '@mui/material/TextField';

// REDUX IIMPORT
import { useSelector,useDispatch } from 'react-redux';
import {changeResult} from './weatherApiSlice';
import { fetchWeather } from './weatherApiSlice';

import { useEffect } from 'react';
import { Description } from '@mui/icons-material';

moment.locale(localStorage.Language);

const theme=createTheme({
  typography:{
    fontFamily:["IBM"] 
  }  
})

function App() {

  const dispatch = useDispatch();
  const weather = useSelector((state)=>{
    return state.weather.weatherResp;
  });

  const isLoading = useSelector((state)=>{
    return state.weather.isLoading;
  })

  const [InputCity,setInputCity] = useState(localStorage.City=="" ? "جيجل":localStorage.City );
  const [dateAndTime,setdateAndTime]=useState("");

  const [Language,setLanguage]=useState(localStorage.Language ?? "ar");
  function handleLanguageClick(){
    if(Language == "en"){
      setLanguage("ar");
      moment.locale("ar");
      localStorage.setItem("Language","ar");
    }else{
      setLanguage("en");
      moment.locale("en");
      localStorage.setItem("Language","en");
    }
    setdateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
  }

  useEffect(()=>{
    localStorage.setItem("City",InputCity);
    setdateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
    //dispatch(changeResult({city:InputCity}));
    dispatch(fetchWeather());
    console.log("after dispatch",weather)
  },[Language,InputCity])
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm" >
          {/* CONTENT CONTAINER */}
          <div style={{height:"100vh",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
            {/* card */}
            <div style={{backgroundColor:"rgb(28 52 91 / 36%)",
              color:"white",
              width:"100%",
              padding:"10px",
              borderRadius:"15px",
              boxShadow:"0px 11px 1px rgba(0,0,0,0.05)"
            }} dir={Language == "ar" ? 'rtl' : 'ltr' }>
              {/* Content */}
              <div>
                {/* City & Time */}
                <div style={{display:"flex",alignItems:"end",justifyContent:"start",marginRight:"20px",fontWeight:"600"}} dir={Language == "ar" ? 'rtl' : 'ltr' }>
                  <Typography variant="h2" gutterBottom>
                      {weather.city}
                  </Typography>
                  <Typography variant="h6" gutterBottom style={{marginRight:Language=="ar"?"20px":"0px",marginLeft:Language=="en"?"20px":"0px"}}>
                    {dateAndTime} 
                  </Typography>
                </div>
                {/*=== City & Time ===*/}
                <hr/>
                {/* CONTAINER OF DEGREE + CLOUD ICON */}
                <div style={{display:"flex",justifyContent:"space-around"}} >
                  {/* Degree & Description */}
                  <div  >
                    <div style={{display:"flex",justifyContent:"center",alignItems:"center"}} >
                      {isLoading ? <CircularProgress style={{color:"white"}} /> : ""}
                      
                      <Typography variant="h1" gutterBottom style={{textAlign:"right"}}>
                        {weather.number}
                      </Typography>
                      <img src={`https://openweathermap.org/img/wn/${weather.Icon}@2x.png`} style={{fontSize:"5px"}} />
                    </div>
                    <Typography variant="h6" gutterBottom style={{}}>
                      {weather.Description}
                    </Typography>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <h5>{Language == "ar"? "الصغرى" :"min"}: {weather.tempMin}</h5>
                      <h5 style={{margin:"0px 5px"}}>|</h5>
                      <h5>{Language == "ar"? "الكبرى" :"max"}: {weather.tempMax}</h5>
                    </div>
                  </div>
                  {/*=== Degree & Description ===*/}
                  <CloudIcon style={{fontSize:"200px",color:"white"}}/>
                </div>
                {/*=== CONTAINER OF DEGREE + CLOUD ICON ===*/}

              </div>
              {/*=== Content ===*/}
            </div>
            {/*=== card ===*/}
            <div dir='rtl' style={{width:"100%",display:"flex",justifyContent:"end",marginTop:"20px"}} >
              <Button style={{color:"white"}} variant="text" onClick={handleLanguageClick} >
                {Language == "en" ? "Arabic" :"إنجليزي" } 
              </Button>
            </div>
            <div>
                    <TextField id="outlined-basic" label="City" variant="outlined" onChange={(e)=>{setInputCity(e.target.value)}} value={InputCity}/>
            </div>
          </div>
          {/*=== CONTENT CONTAINER ===*/}
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
