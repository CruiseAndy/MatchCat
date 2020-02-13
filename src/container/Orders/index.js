/*
 * Writer : paul
 */

// Tools
import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { queryOrders } from "../../actions";
import { Actions } from "react-native-router-flux";
import SwitchSelector from "react-native-switch-selector";
// Components
import SellOrders from "./SellOrders";
import BuyOrders from "./BuyOrders";
import { Card, IconBlock } from "../../components/common";
import Language from "../../Language.json";

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "",
      switchOptions: []
    };
    this.Lang = Language[this.props.langCountry].ordersPage;
  }
  componentWillMount() {
    this.props.switchOptionsVal && this.onTabHandler(this.props.switchOptionsVal);
  }
  onTabHandler = str => {
    this.setState({
      activeTab: str
    });
  };
  componentDidMount() {
    // setting tab default
    !this.props.switchOptionsVal && this.onTabHandler("sell");
    // setting switchOptions
    this.setState({
      switchOptions: [
        {
          label: this.Lang.sell.title,
          value: "sell",
          activeColor: "#FD7044"
        },
        {
          label: this.Lang.buy.title,
          value: "buy",
          activeColor: "#FD7044"
        }
      ]
    });
  }
  componentWillReceiveProps(nextProps) {
    this.Lang = Language[nextProps.langCountry].ordersPage;
  }
  render() {
    return (
      <Card
        style={{
          backgroundColor: this.state.activeTab === "sell" ? "#fff" : "#F6F6F6"
        }}
      >
        {/* header */}
        <View style={orderStyle.header}>
          <IconBlock
            name="chevron-left"
            style={{
              paddingLeft: 15
            }}
            onPress={() => Actions.reset("home")}
          />
          <View style={orderStyle.tabs}>
            {this.state.switchOptions.length === 0 ? (
              false
            ) : (
              <SwitchSelector
                style={{
                  width: "85%",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
                height={35}
                hasPadding={true}
                borderColor="#FD7044"
                backgroundColor="#fff"
                textStyle={{ color: "#FD7044", fontWeight: "600" }}
                selectedTextStyle={{ color: "#fff", fontWeight: "600" }}
                options={this.state.switchOptions}
                initial={this.state.switchOptions.findIndex(
                  item => item.value === this.state.activeTab
                )}
                onPress={value => this.onTabHandler(value)}
              />
            )}
          </View>
          <IconBlock
            name="chevron-right"
            style={{
              paddingRight: 15,
              opacity: 0
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          {/* content  */
          this.state.activeTab === "sell" ? (
            <SellOrders Lang={this.Lang} />
          ) : this.state.activeTab === "buy" ? (
            <BuyOrders Lang={this.Lang} />
          ) : (
            false
          )}
        </View>
      </Card>
    );
  }
}
const orderStyle = StyleSheet.create({
  header: {
    paddingBottom: 8,
    flexDirection: "row"
  },
  tabs: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  tabItem: {
    justifyContent: "center"
  },
  pageTitle: {
    color: "#FD7348",
    fontSize: 18
  },
  nextPageTitle: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    color: "#000",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#000"
  }
});

const mapStateToProps = state => {
  return {
    langCountry: state.languageType.langCountry
  };
};

export default connect(
  mapStateToProps,
  { queryOrders }
)(Orders);
