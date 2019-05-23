import React, { useState, useEffect } from 'react';
import Check from '../assets/svg/check.svg';

const elems = [
  {
    title: 'elem1',
    isChecked: true,
  },
  {
    title: 'elem2',
    isChecked: true,
  },
  {
    title: 'elem3',
    isChecked: true,
  },
  {
    title: 'elem4',
    isChecked: true,
  },
  {
    title: 'elem5',
    isChecked: false,
  },
];

const CheckList = props => {
  const elemHeight = 25;

  return (
    <div className="checklist">
      {elems.map(elem => {
        return (
          <div key={elem.title}>
            <div className="checklist-checkmark">
              {elem.isChecked ? (
                <img src="https://cdn.pixabay.com/photo/2017/01/31/17/55/check-mark-2025986_1280.png" />
              ) : (
                '2'
              )}
            </div>
            <div className="checklist-title">{elem.title}</div>
          </div>
        );
      })}
      <style jsx>{`
        .checklist {
          height: 100%;
        }

        .checklist > div {
          display: flex;
          margin-bottom: ${elemHeight}px;
        }

        .checklist-checkmark {
          position: relative;
        }

        .checklist-checkmark img {
          width: 30px;
          height: 30px;
          background: blue;
          border-radius: 100%;
        }

        .checklist-checkmark::after {
          content: '';
          position: absolute;
          left: ${elemHeight / 2}px;
          height: ${elemHeight + 2}px;
          border: solid red 1px;
          bottom: -${elemHeight}px;
        }

        .checklist-title {
          margin-left: 20px;
        }
      `}</style>
    </div>
  );
};

export default CheckList;
