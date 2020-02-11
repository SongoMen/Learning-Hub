import React from "react";
import humanizeDuration from "humanize-duration";
import PropTypes from "prop-types"

import Loader from "../elements/Loader";

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms",
    },
  },
});

function statCharts(stats, maxValue) {
  return stats.date.map((val, indx) => (
    <div className="Stats__day" key={indx}>
      <h6>
        <span className="Stats__first">{val.split(" ")[0]}</span>{" "}
        {val.split(" ")[1]} {val.split(" ")[2]}
      </h6>
      <div className="Stats__slider">
        {stats.time[parseInt(indx)] > 0 &&
          stats.styles.map((val2, indx2) => {
            if (
              (stats.fullDates[parseInt(indx)] ===
                `${val2.split(" ")[0]} ${val2.split(" ")[1]} ${
                  val2.split(" ")[2]
                }` ||
                stats.fullDates[parseInt(indx)] ===
                  `${val2.split(" ")[1]} ${val2.split(" ")[2]} ${
                    val2.split(" ")[3]
                  }`) &&
              stats[stats.names[parseInt(indx2)]] > 0
            ) {
              let he =
                (" ", stats[stats.names[parseInt(indx2)]] / maxValue) * 100 +
                "%";
              return (
                <div
                  key={indx2}
                  className={"Stats__slider-active " + val2}
                  style={{
                    height: he,
                  }}></div>
              );
            } else return "";
          })}
      </div>
      <h6>
        {shortEnglishHumanizer(parseInt(stats.time[parseInt(indx)] * 1000), {
          largest: 2,
          round: true,
        })}
      </h6>
    </div>
  ));
}

const Stats = props => {
  const {statsLoader, selectValue, changeWeek, stats, maxValue} = props;
  console.log(props)
  return (
    <div className="Stats">
      {statsLoader ? (
        <Loader />
      ) : (
        <div className="Stats__days">
          <div className="title">
            <h5>TIME SPENT ON LEARNING</h5>
            <label htmlFor="select"></label>
            <select
              name="select"
              value={selectValue}
              onChange={changeWeek}
              className="Stats__selectWeek">
              <option value="This week">This week</option>
              <option value="Last week">Last week</option>
            </select>
          </div>
          <div className="Stats__chart">{statCharts(stats, maxValue)}</div>
        </div>
      )}
    </div>
  );
};
Stats.propTypes = {
  statsLoader: PropTypes.bool,
  selectValue: PropTypes.string,
  changeWeek: PropTypes.func,
  stats: PropTypes.object,
  maxValue: PropTypes.oneOfType([PropTypes.number,PropTypes.string])
}
export default Stats;
