import React, { useCallback } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const DateSlider = ({
  dates,
  currentDate,
  setDate
}: {
  dates: string[];
  currentDate: string;
  setDate: (date: string) => void;
}) => {
  const dateIndex = dates.indexOf(currentDate);
  const noPreviousDate = dateIndex <= 0;
  const noNextDate = dateIndex >= dates.length - 1;
  const setDateCallback = useCallback(
    ev => setDate(dates[parseInt(ev.target.value)]),
    [dates, setDate]
  );
  const previousDate = useCallback(ev => setDate(dates[dateIndex - 1]), [
    dates,
    setDate,
    dateIndex
  ]);
  const nextDate = useCallback(ev => setDate(dates[dateIndex + 1]), [
    dates,
    setDate,
    dateIndex
  ]);
  return (
    <Form>
      <Form.Group controlId="formBasicRangeCustom">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="range"
          min={0}
          max={dates.length - 1}
          step={1}
          value={dateIndex.toString()}
          onChange={setDateCallback}
        />
        <Form.Label>{currentDate}</Form.Label>
        <Form.Group>
          <Button size="sm" onClick={previousDate} disabled={noPreviousDate}>
            Previous
          </Button>
          &nbsp;
          <Button size="sm" onClick={nextDate} disabled={noNextDate}>
            Next
          </Button>
        </Form.Group>
      </Form.Group>
    </Form>
  );
};

export default DateSlider;
