import React, { useState} from "react";
import styled from "styled-components";



const Cookfood = ({ className }) => {
  // กำหนดค่าเริ่มต้นของ namefood เป็น ""
  const [namefood, setNamefood] = useState("ข้าวผัด");
  const [calories, setCalories] = useState(0);
  const [num, setNum] = useState(0);
  const [carbo, setCarbo] = useState(0);
  const [protein, setProtein] = useState(0);
  const [vegetable, setVegetable] = useState(0); 
  const [fat, setFat] = useState(0);
  const [sugar, setSugar] = useState(0);
  const [salt, setSalt] = useState(0);

  // เมื่อมีการเปลี่ยนแปลงใน input รับค่าและอัปเดต namefood
  const handleNamefoodChange = (event) => {
    setNamefood(event.target.value);
  };

  const handleCaloriesChange = (event) => {
    setCalories(Number(event.target.value)); 
  };

  const handleNumChange = (event) => {
    setNum(Number(event.target.value)); 
  };
  const handleCarboChange = (event) => {
    setCarbo(Number(event.target.value)); 
  };
  const handleProteinChange = (event) => {
    setProtein(Number(event.target.value)); 
  };
  const handleVegetableChange = (event) => {
    setVegetable(Number(event.target.value)); 
  };
  const handleFatChange = (event) => {
    setFat(Number(event.target.value)); 
  };
  const handleSugarChange = (event) => {
    setSugar(Number(event.target.value)); 
  };
  const handleSaltChange = (event) => {
    setSalt(Number(event.target.value)); 
  };
  
return (
  <div className={className}>
    <div className="back">
      <button class="btn btn-active btn-secondary">⬅back</button>
    </div>
    <div className="Text">
      <h1>
        <b>เพิ่มรายการอาหาร</b>
      </h1>
    </div>
    <div className="DataAll">
      <div className="Data">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text1">ชื่ออาหาร</span>
            <span className="label-text-alt"></span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={namefood} // ใช้ค่าจาก namefood เป็นค่าเริ่มต้นของ input
            onChange={handleNamefoodChange} // เรียกใช้ฟังก์ชัน handleNamefoodChange เมื่อมีการเปลี่ยนแปลงใน input
          />
        </div>
      </div>

      <div className="Data">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text1">แคลลอรี่</span>
            <span className="label-text-alt">Kcal</span>
          </label>
          <input
            type="number"
            min="0"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={calories}
            onChange={handleCaloriesChange}
          />
          
        </div>
      </div>

      <div className="Data">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text1">จำนวน</span>
            <span className="label-text-alt">จาน</span>
          </label>
          <input
            type="number"
            min="0"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={num}
            onChange={handleNumChange}
          />
        </div>
      </div>
      <div className="Text">
        <h1>
          <b>โภชนาการโดยประมาณ</b>
        </h1>
      </div>
      <div className="Data">
        <select className="select select-primary w-full max-w-xs">
          <option disabled selected>
            คาร์โบไฮเดรต
          </option>
          <option>ข้าว</option>
          <option>ขนมปัง</option>
          <option>ขนมจีน</option>
          <option>เส้นใหญ่</option>
          <option>เส้นเล็ก</option>
          <option>เส้นบะหมี่</option>
          <option>เส้นพาสต้า</option>
        </select>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">จำนวน</span>
            <span className="label-text-alt">ช้อนโต๊ะ</span>
          </label>
          <input
            type="number"
            min="0"
            placeholder="Type here"
            class="input input-bordered input-primary w-full max-w-xs"
            value={carbo}
            onChange={handleCarboChange}
          />
        </div>
      </div>
      <div className="Data">
        <select className="select select-secondary w-full max-w-xs">
          <option disabled selected>
            โปรตีน
          </option>
          <option>ไข่ไก่</option>
          <option>ไข่เป็ด</option>
          <option>ไก่</option>
          <option>หมู</option>
          <option>เนื้อ</option>
          <option>เป็ด</option>
          <option>กุ้ง</option>
          <option>หอย</option>
          <option>ปู</option>
          <option>ปลา</option>
          <option>ปลาหมึก</option>
        </select>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">จำนวน</span>
            <span className="label-text-alt">ช้อนโต๊ะ</span>
          </label>
          <input
            type="number"
            min="0"
            placeholder="Type here"
            className="input input-bordered input-secondary w-full max-w-xs"
            value={protein}
            onChange={handleProteinChange}
          />
        </div>
      </div>
      <div className="Data">
        <select className="select select-success w-full max-w-xs">
          <option disabled selected>
            ผัก
          </option>
          <option>สด</option>
          <option>สุก</option>
        </select>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">จำนวน</span>
            <span className="label-text-alt">ช้อนโต๊ะ</span>
          </label>
          <input
            type="number"
            min="0"
            placeholder="Type here"
            className="input input-bordered input-success w-full max-w-xs"
            value={vegetable}
            onChange={handleVegetableChange}
          />
        </div>
      </div>
      <div className="Data">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text1">ไขมัน</span>
            <span className="label-text-alt">ช้อนโต๊ะ</span>
          </label>
          <input
            type="number"
            min="0"
            placeholder="Type here"
            className="input input-bordered input-warning w-full max-w-xs"
            value={fat}
            onChange={handleFatChange}
          />
        </div>
      </div>
      <div className="Data">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text1">น้ำตาล</span>
            <span className="label-text-alt">ช้อนชา</span>
          </label>
          <input
           type="number"
           min="0"
            placeholder="Type here"
            className="input input-bordered input-error w-full max-w-xs"
            value={sugar}
            onChange={handleSugarChange}
          />
        </div>
      </div>
      <div className="Data">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text1">เกลือ</span>
            <span className="label-text-alt">ช้อนชา</span>
          </label>
          <input
            type="number"
            min="0"
            placeholder="Type here"
            className="input input-bordered input-info w-full max-w-xs"
            value={salt}
            onChange={handleSaltChange}
          />
        </div>
      </div>
    </div>
    <div class="confirm">
      <button class="btn btn-success">Confirm</button>
    </div>
  </div>
);};


export default styled(Cookfood)`
  .back {
    position: absolute;
    top: 20px;
    left: 20px;
    padding: 10px 20px;
    font-size: calc(60% + 2vmin);
  }
  .Text h1 {
    font-size: calc(60% + 2vmin);
    color: black;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 5rem;
  }
  .DataAll {
    font-size: calc(60% + 2vmin);
    padding: 50px;
    color: black;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .Data {
    padding: 20px;
  }
  .label-text1 {
    font-size: calc(60% + 1vmin); /* กำหนดขนาดตัวหนังสือใน .label-text */
  }

  .input {
    font-size: calc(60% + 1vmin); /* กำหนดขนาดตัวหนังสือใน .input */
  }
  .confirm {
    display: flex;
    justify-content: center;
    height: 4rem;
  }
`;
