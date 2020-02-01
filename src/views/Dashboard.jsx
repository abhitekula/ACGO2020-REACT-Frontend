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
          series: [[]]
      },
      engine_oil_press: {
          labels: [],
          series: [[]]
      },
      engine_speed: {
          labels: [],
          series: [[]]
      },
      fuel_delivery_pressures: {
          labels: [],
          series: [[]]
      },
      fuel_level: {
          labels: [],
          series: [[]]
      },
      fuel_rate: {
          labels: [],
          series: [[]]
      },
      hydr_oil_temp: {
          labels: [],
          series: [[]]
      },
      spray_nozzle_pressure: {
          labels: [],
          series: [[]]
      },
      engine_anomaly: {
        labels: [],
        series: [[]]
      },
      equipment_anomaly: {
        labels: [],
        series: [[]]
      },
  }
  keyToFieldName = {
    engine_coolant_temp: "Engine Coolant Temperature",          
    engine_oil_press: "Engine Oil Pressure",
    engine_speed: "Engine Speed",
    fuel_delivery_pressures: "Fuel Delivery Pressures",
    fuel_level: "Fuel Level",
    fuel_rate: "Fuel Rate",
    hydr_oil_temp: "Hydr Oil Temperature",
    spray_nozzle_pressure: "Spray Nozzle Pressure",
    engine_anomaly: "Engine Anomaly",
    equipment_anomaly: "Equipment Anomaly"
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

      if (labels.length > NUM_OF_ITEMS && series.length == idx + 1) {
          labels = labels.slice(1, NUM_OF_ITEMS + 1)
          for (let i = 0; i < series.length; i++) {
              series[i] = series[i].slice(1, NUM_OF_ITEMS + 1)
          }
      }

      return {
          labels: labels,
          series: series
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
      let engine_anomaly = state.engine_anomaly
      let equipment_anomaly = state.equipment_anomaly
      console.log(state)
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
                    equipment_anomaly = bigBoyThis.update(equipment_anomaly, 0, curr[key])
                  } else {
                    engine_anomaly = bigBoyThis.update(engine_anomaly, 0, curr[key])
                  }
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
          engine_anomaly: engine_anomaly,
          equipment_anomaly: equipment_anomaly,
      }
  }
  intervalExpired() {
    fetch("https://ajeubjqyic.execute-api.us-east-1.amazonaws.com/default/FetchEngineDataFromDynamo")
        .then(res => res.json())
        .then(
          (result) => {
            this.data = result
            console.log(result);
            let prevState = this.refreshView(this.state)
            fetch("https://xa2br4ebq9.execute-api.us-east-1.amazonaws.com/default/FetchEquipmentDataFromDynamo")
            .then(res => res.json())
            .then(
              (result) => {
                this.data = result
                console.log(result);
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
    }, 1000);
    this.setState({ intervalId: intervalId });
  }
  componentDidMount() {
    this.startGettingData()
  }

  render() {
    var that = this
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
                  if (key == "intervalId") {
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
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      datasets: [
        {
          label: "Active Users",
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
                      options={dashboardShippedProductsChart2.options}
                    />
                  </div>
                </CardBody>
                <CardFooter>
                  <div className="stats">
                    <i className="now-ui-icons arrows-1_refresh-69" /> Just
                    Updated
                  </div>
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
