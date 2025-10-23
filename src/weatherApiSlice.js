import { Language } from '@mui/icons-material';
import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


let cancelAxios=null;


export const fetchWeather = createAsyncThunk("weatherApi/fetchWeather",async ()=>{
  const api={
            key:"28ccbdb957277c9846e60d82ef3cac15",
        };
  const City = localStorage.City;
  const Language = localStorage.Language;  
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${City}&lang=${Language}&appid=${api.key}`,
      {
        cancelToken: new axios.CancelToken((c)=>{
          cancelAxios = c;
        })
      });
      console.log("the response",response);
      const number = Math.round(Number(response.data.main.temp) - 272.15);
      const tempMax = Math.round(Number(response.data.main.temp_max) - 272.15);
      const tempMin = Math.round(Number(response.data.main.temp_min) - 272.15);
      const Description = response.data.weather[0].description;
      const city = response.data.name;
      const Icon = response.data.weather[0].icon;
      return ({number , tempMax,tempMin,Description,city,Icon});
    });


const initialState = {
  result : "empty",
  weatherResp :{
    number:null,
    Description:"",
    tempMax:null,
    tempMin:null,
    Icon:"",
    city:""
  },
  isLoading : false,
};


export const weatherApiSlice = createSlice({
  name: "weatherApi",
  initialState,
  reducers: {
    changeResult:(currentState,action)=>{
        console.log("change"); 
    },
  },
  extraReducers(builder){
    builder.addCase(fetchWeather.pending,(state,action)=>{
      console.log("reseived weatherApi/fetchWeather/pending");
      state.isLoading = true;
    })
    .addCase(fetchWeather.fulfilled,(state,action)=>{
      state.isLoading = false;
      state.weatherResp.number = action.payload.number;
      state.weatherResp.tempMax = action.payload.tempMax;
      state.weatherResp.tempMin = action.payload.tempMin;
      state.weatherResp.city = action.payload.city;
      state.weatherResp.Icon = action.payload.Icon;
      state.weatherResp.Description = action.payload.Description;
    })
    .addCase(fetchWeather.rejected,(state,action)=>{
      state.isLoading = false
    })
  }
});
export const {changeResult} = weatherApiSlice.actions;

export default weatherApiSlice.reducer;