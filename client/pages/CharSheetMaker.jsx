import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import FormControl from '@mui/material/FormControl';
// import FormGroup from '@mui/material/FormGroup';
// import InputLabel from '@mui/material/InputLabel';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
import { Button, TextField, FormControl, FormGroup, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { UserContext } from '../components/UserProvider';

export default function CharSheetMaker() {
  const { activeUser, setActiveUser } = useContext(UserContext);
  const [charName, setCharName] = useState('');
  const [charRace, setCharRace] = useState('');
  const [charClass, setCharClass] = useState('');
  const [str, setStr] = useState(1);
  const [dex, setDex] = useState(1);
  const [con, setCon] = useState(1);
  const [int, setInt] = useState(1);
  const [wis, setWis] = useState(1);
  const [cha, setCha] = useState(1);
  const [charDesc, setDesc] = useState('');
  const navigate = useNavigate();

  const numArr = [];

  for (let i = 1; i <= 20; i++) {
    numArr.push(i);
  }

  function handleClick() {
    axios
      .post('/sheet/', {
        sheet: {
          charName,
          charClass,
          charRace,
          charDesc,
          str,
          dex,
          con,
          int,
          wis,
          cha,
          userId: activeUser.id,
        },
      })
      .then(() => navigate(`/user/${activeUser.id}`))
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <FormGroup>
        <TextField
          id="character-name"
          variant="filled"
          placeholder="character name"
          onChange={(e) => setCharName(e.target.value)}
        />

        <TextField
          id="character-race"
          variant="filled"
          placeholder="character race"
          onChange={(e) => setCharRace(e.target.value)}
        />

        <TextField
          id="character-class"
          variant="filled"
          placeholder="character class"
          onChange={(e) => setCharClass(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <div>
          <FormControl style={{ margin: 10, width: 300 }}>
            <InputLabel>STRENGTH</InputLabel>
            <Select
              value={str}
              label="STRENGTH"
              onChange={(e) => setStr(e.target.value)}
            >
              {numArr.map((num) => (
                <MenuItem
                  key={`${num}-str`}
                  value={num}
                >
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl style={{ margin: 10, width: 300 }}>
            <InputLabel>DEXTERITY</InputLabel>
            <Select
              value={dex}
              label="DEXTERITY"
              onChange={(e) => setDex(e.target.value)}
            >
              {numArr.map((num) => (
                <MenuItem
                  key={`${num}-dex`}
                  value={num}
                >
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl style={{ margin: 10, width: 300 }}>
            <InputLabel>CONSTITUTION</InputLabel>
            <Select
              value={con}
              label="CONSTITUTION"
              onChange={(e) => setCon(e.target.value)}
            >
              {numArr.map((num) => (
                <MenuItem
                  key={`${num}-con`}
                  value={num}
                >
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div>
          <FormControl style={{ margin: 10, width: 300 }}>
            <InputLabel>INTELLEGENCE</InputLabel>
            <Select
              value={int}
              label="INTELLEGENCE"
              onChange={(e) => setInt(e.target.value)}
            >
              {numArr.map((num) => (
                <MenuItem
                  key={`${num}-int`}
                  value={num}
                >
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl style={{ margin: 10, width: 300 }}>
            <InputLabel>WISDOM</InputLabel>
            <Select
              value={wis}
              label="WISDOM"
              onChange={(e) => setWis(e.target.value)}
            >
              {numArr.map((num) => (
                <MenuItem
                  key={`${num}-wis`}
                  value={num}
                >
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl style={{ margin: 10, width: 300 }}>
            <InputLabel>CHARISMA</InputLabel>
            <Select
              value={cha}
              label="CHARISMA"
              onChange={(e) => setCha(e.target.value)}
            >
              {numArr.map((num) => (
                <MenuItem
                  key={`${num}-cha`}
                  value={num}
                >
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </FormGroup>
      <FormGroup>
        <TextField
          id="character-desc"
          variant="filled"
          placeholder="character description"
          onChange={(e) => setDesc(e.target.value)}
        />
      </FormGroup>
      <Button onClick={() => handleClick()}>Create</Button>
    </div>
  );
}
