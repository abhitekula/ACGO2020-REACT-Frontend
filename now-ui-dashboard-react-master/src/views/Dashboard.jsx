/*!

=========================================================
* Now UI Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

import 'status-indicator/styles.css'


// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
  Button,
  Label,
  FormGroup,
  Input,
  UncontrolledTooltip
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.jsx";

import {
  dashboardPanelChart,
  dashboardShippedProductsChart,
  dashboardShippedProductsChart2,
  dashboardAllProductsChart,
  dashboard24HoursPerformanceChart
} from "variables/charts.jsx";

class Dashboard extends React.Component {
  state = {
      engine_coolant_temp: {
          labels: [],
          series: [[]],
          anomalies: [0, 0, 0]
      },
      engine_oil_press: {
          labels: [],
          series: [[]],
          anomalies: [0, 0, 0]
      },
      engine_speed: {
          labels: [],
          series: [[]],
          anomalies: [0, 0, 0]
      },
      fuel_delivery_pressures: {
          labels: [],
          series: [[]],
          anomalies: [0, 0, 0]
      },
      fuel_level: {
          labels: [],
          series: [[]],
          anomalies: [0, 0, 0]
      },
      fuel_rate: {
          labels: [],
          series: [[]],
          anomalies: [0, 0, 0]
      },
      hydr_oil_temp: {
          labels: [],
          series: [[]],
          anomalies: [0, 0, 0]
      },
      spray_nozzle_pressure: {
          labels: [],
          series: [[]],
          anomalies: [0, 0, 0]
      },
      anomaly: {
        labels: [],
        series: [[], []]
      },
  }
  keyToFieldName = {
    engine_coolant_temp: "Engine Coolant Temperature",          
    engine_oil_press: "Engine Oil Pressure",
    engine_speed: "Engine Speed",
    fuel_delivery_pressures: "Fuel Delivery Pressure",
    fuel_level: "Fuel Level",
    fuel_rate: "Fuel Rate",
    hydr_oil_temp: "Hydr Oil Temperature",
    spray_nozzle_pressure: "Spray Nozzle Pressure",
    anomaly: {
      engine_anomaly: "Engine Anomaly",
      equipment_anomaly: "Equipment Anomaly"
    }
  }
  keyToAnomaly = {
    engine_coolant_temp: "coolantAnomalyScore",          
    engine_oil_press: "oilAnomalyScore",
    engine_speed: "speedAnomalyScore",
    fuel_delivery_pressures: "fdpAnomalyScore",
    fuel_level: "flAnomalyScore",
    fuel_rate: "frAnomalyScore",
    hydr_oil_temp: "hoAnomalyScore",
    spray_nozzle_pressure: "snAnomalyScore",
  }
  update(prev, idx, curr) {
      const NUM_OF_ITEMS = 12

      let series = prev["series"]
      series[idx] = [...series[idx], curr]
      let labels = prev.labels
      if (idx == 0) {
          if (labels.length == 0) {
              labels = [1]
          } else {
              labels = [...labels, labels[labels.length - 1] + 1]
          }
      }

      if (labels.length >= NUM_OF_ITEMS) {
        if (series.length == idx + 1) {
          labels = labels.slice(1)
        }
          // labels = labels.slice(1)
          // for (let i = 0; i < series.length; i++) {
          //     series[i] = series[i].slice(1)
          // }
          series[idx] = series[idx].slice(1)
      }

      return {
          labels: labels,
          series: series,
          anomalies: prev.anomalies
      }
  }

  getAnomalyLevel(anomaly) {
    if (anomaly > 4) {
      return 2
    } else if (anomaly > 3) {
      return 1
    } else {
      return 0
    }
  }
  refreshView(state) {
      let curr = this.data
      let engine_coolant_temp = state.engine_coolant_temp
      let engine_oil_press = state.engine_oil_press
      let engine_speed = state.engine_speed
      let fuel_delivery_pressures = state.fuel_delivery_pressures
      let fuel_level = state.fuel_level
      let fuel_rate = state.fuel_rate
      let hydr_oil_temp = state.hydr_oil_temp
      let spray_nozzle_pressure = state.spray_nozzle_pressure
      let anomaly = state.anomaly
      let bigBoyThis = this;
      Object.keys(curr).map(function(key) {
          switch(key) {
              case "ENGINE_COOLANT_TEMP":
                  engine_coolant_temp = bigBoyThis.update(engine_coolant_temp, 0, curr[key])
                  break;
              case "HYDR_OIL_TEMP":
                  hydr_oil_temp = bigBoyThis.update(hydr_oil_temp, 0, curr[key])
                  break;

              case "SPRAY_NOZZLE_PRESSURE":
                  spray_nozzle_pressure = bigBoyThis.update(spray_nozzle_pressure, 0, curr[key])
                  break;

              case "ENGINE_OIL_PRESS":
                  engine_oil_press = bigBoyThis.update(engine_oil_press, 0, curr[key])
                  break;
              
              case "ENGINE_SPEED":
                  engine_speed = bigBoyThis.update(engine_speed, 0, curr[key])
                  break;

              case "FUEL_DELIVERY_PRESSURES":
                  fuel_delivery_pressures = bigBoyThis.update(fuel_delivery_pressures, 0, curr[key])
                  break;

              case "FUEL_LEVEL":
                  fuel_level = bigBoyThis.update(fuel_level, 0, curr[key])
                  break;

              case "FUEL_RATE":
                  fuel_rate = bigBoyThis.update(fuel_rate, 0, curr[key])
                  break;

              case "ANOMALY_SCORE":
                  if (curr["ENGINE_COOLANT_TEMP"] == undefined) {
                    anomaly = bigBoyThis.update(anomaly, 0, curr[key])
                  } else {
                    anomaly = bigBoyThis.update(anomaly, 1, curr[key])
                  }
                  break

              case "COOLANT_ANOMALY_SCORE":
                  engine_coolant_temp.anomalies[bigBoyThis.getAnomalyLevel(curr[key])]++
                  bigBoyThis.setState({ coolantAnomalyScore: curr[key]})
                  break

              case "HO_ANOMALY_SCORE":
                  bigBoyThis.setState({ hoAnomalyScore: curr[key]})
                  hydr_oil_temp.anomalies[bigBoyThis.getAnomalyLevel(curr[key])]++
                  break

              case "SN_ANOMALY_SCORE":
                  bigBoyThis.setState({ snAnomalyScore: curr[key]})
                  spray_nozzle_pressure.anomalies[bigBoyThis.getAnomalyLevel(curr[key])]++
                  break

              case "OIL_ANOMALY_SCORE":
                  bigBoyThis.setState({ oilAnomalyScore: curr[key]})
                  engine_oil_press.anomalies[bigBoyThis.getAnomalyLevel(curr[key])]++
                  break

              case "SPEED_ANOMALY_SCORE":
                  bigBoyThis.setState({ speedAnomalyScore: curr[key]})
                  engine_speed.anomalies[bigBoyThis.getAnomalyLevel(curr[key])]++
                  break

              case "FDP_ANOMALY_SCORE":
                  bigBoyThis.setState({ fdpAnomalyScore: curr[key]})
                  fuel_delivery_pressures.anomalies[bigBoyThis.getAnomalyLevel(curr[key])]++
                  break

              case "FL_ANOMALY_SCORE":
                  bigBoyThis.setState({ flAnomalyScore: curr[key]})
                  fuel_level.anomalies[bigBoyThis.getAnomalyLevel(curr[key])]++
                  break

              case "FR_ANOMALY_SCORE":
                  bigBoyThis.setState({ frAnomalyScore: curr[key]})
                  fuel_rate.anomalies[bigBoyThis.getAnomalyLevel(curr[key])]++
                  break
          }
      })

      return {
          engine_coolant_temp: engine_coolant_temp,          
          engine_oil_press: engine_oil_press,
          engine_speed: engine_speed,
          fuel_delivery_pressures: fuel_delivery_pressures,
          fuel_level: fuel_level,
          fuel_rate: fuel_rate,
          hydr_oil_temp: hydr_oil_temp,
          spray_nozzle_pressure: spray_nozzle_pressure,
          anomaly: anomaly,
      }
  }
  intervalExpired() {
    fetch("https://ajeubjqyic.execute-api.us-east-1.amazonaws.com/default/FetchEngineDataFromDynamo")
        .then(res => res.json())
        .then(
          (result) => {
            this.data = result
            let prevState = this.refreshView(this.state)
            fetch("https://xa2br4ebq9.execute-api.us-east-1.amazonaws.com/default/FetchEquipmentDataFromDynamo")
            .then(res => res.json())
            .then(
              (result) => {
                this.data = result
                prevState = this.refreshView(prevState)
                this.setState(prevState)
              },
              (error) => {
                // TODO: what's an error?
              }
            )
          },
          (error) => {
            // TODO: what's an error?
          }
        )
  }
  startGettingData() {
    var intervalId = setInterval(() => {
      this.intervalExpired()
    }, 2000);
    this.setState({ intervalId: intervalId });
  }
  componentDidMount() {
    this.startGettingData()
  }

  render() {
    var that = this
    dashboardPanelChart.data = canvas => {
    const ctx = canvas.getContext("2d");
    var chartColor = "#FFFFFF";
    var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, "#80b6f4");
    gradientStroke.addColorStop(1, chartColor);
    var gradientFill = ctx.createLinearGradient(0, 200, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.14)");

    return {
      labels: that.state["anomaly"].labels,
      datasets: [
        {
          label: "Equipment Anomaly Score",
          borderColor: chartColor,
          pointBorderColor: chartColor,
          pointBackgroundColor: "#15304e",
          pointHoverBackgroundColor: "#ffffff",
          pointHoverBorderColor: "#15304e",
          pointBorderWidth: 1,
          pointHoverRadius: 7,
          pointHoverBorderWidth: 2,
          pointRadius: 5,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 2,
          data: that.state["anomaly"].series[0]
        },
        {
          label: "Engine Anomaly Score",
          borderColor: "#ffa500",
          pointBorderColor: "#ffa500",
          pointBackgroundColor: "#15304e",
          pointHoverBackgroundColor: "#ffa500",
          pointHoverBorderColor: "#ffa500",
          pointBorderWidth: 1,
          pointHoverRadius: 7,
          pointHoverBorderWidth: 2,
          pointRadius: 5,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 2,
          data: that.state["anomaly"].series[1]
        }
      ]
    };
  }
    return (
      <>
        <PanelHeader
          size="lg"
          content={
            <Line
              data={dashboardPanelChart.data}
              options={dashboardPanelChart.options}
            />
          }
        />
        <div className="content">
        <Row>
              {
                Object.keys(that.state).map(function(key, idx) {
                  if (key == "intervalId" || key.toLowerCase().includes("anomaly")) {
                    return null
                  }

                  dashboardShippedProductsChart2.data = canvas => {
    var ctx = canvas.getContext("2d");
    var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, "#80b6f4");
    gradientStroke.addColorStop(1, "#FFFFFF");
    var gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, (key == "hydr_oil_temp" || key == "spray_nozzle_pressure") ? "rgba(0, 255, 0, 0.40)" : "rgba(0, 0, 255, 0.40)");
    gradientFill.addColorStop(1, (key == "hydr_oil_temp" || key == "spray_nozzle_pressure") ? "rgba(0, 255, 0, 0.40)" : "rgba(0, 0, 255, 0.40)");
    return {
      labels: that.state[key].labels,
      datasets: [
        {
          label: "",
          borderColor: (key == "hydr_oil_temp" || key == "spray_nozzle_pressure") ? "#00FF00" : "#0000FF",
          pointBorderColor: "#FFF",
          pointBackgroundColor: (key == "hydr_oil_temp" || key == "spray_nozzle_pressure") ? "#00FF00" : "#0000FF",
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 2,
          data: that.state[key].series[0]
        }
      ]
    };
  }
  let statusText = "No Anomalies Detected"
  let statusIndicator = <status-indicator positive pulse></status-indicator>
  const anomalyLevel = that.getAnomalyLevel(that.state[that.keyToAnomaly[key]])
  if (anomalyLevel == 2) {
    statusIndicator = <status-indicator negative pulse></status-indicator>
    statusText = "Severe Anomaly Detected"
    fetch("https://jvlkjp1vva.execute-api.us-east-1.amazonaws.com/default/SendAlertToSNS?anomaly=error&source=" + key + "&value=" + that.state[key].series[0][that.state[key].series[0].length - 1] + "&score=" + that.state[that.keyToAnomaly[key]])
        .then(res => res.json())
        .then(
          (result) => {

          },
          (error) => {
            // TODO: what's an error?
          }
        )
  } else if (anomalyLevel == 1) {
    statusText = "Slight Anomaly Detected"
    statusIndicator = <status-indicator intermediary pulse></status-indicator>
    fetch("https://jvlkjp1vva.execute-api.us-east-1.amazonaws.com/default/SendAlertToSNS?anomaly=warning&source=" + key + "&value=" + that.state[key].series[0][that.state[key].series[0].length - 1] + "&score=" + that.state[that.keyToAnomaly[key]])
        .then(res => res.json())
        .then(
          (result) => {

          },
          (error) => {
            // TODO: what's an error?
          }
        )
  }
      const anomalies = that.state[key]["anomalies"]
                  return (
                    <Col xs={12} md={4}>
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">{(key == "hydr_oil_temp" || key == "spray_nozzle_pressure") ? "Equipment Monitoring": "Engine Monitoring"}</h5>
                  <CardTitle tag="h4">{that.keyToFieldName[key]}</CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={dashboardShippedProductsChart2.data}
                      options={dashboardShippedProductsChart.options}
                    />
                  </div>
                </CardBody>
                <CardFooter>
                  <div className="stats">
                    {statusText} <br/>Warnings: {anomalies[1]}, Dangers: {anomalies[2]}
                  </div>
                  {statusIndicator}
                </CardFooter>
              </Card>
            </Col>
                  )
              })
              }
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;