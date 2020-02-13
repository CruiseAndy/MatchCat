import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

class PeriodType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: {},
      periods: [
        {
          title: "day",
          remoteRequest: {
            key: "day",
            value: 0
          }
        },
        {
          title: "yesterday",
          remoteRequest: {
            key: "day",
            value: 1
          }
        },
        {
          title: "week",
          remoteRequest: {
            key: "week",
            value: 0
          }
        },
        {
          title: "month",
          remoteRequest: {
            key: "month",
            value: 0
          }
        }
      ]
    };
  }
  componentDidMount() {
    // setting component default status & trigger event
    this.onSetActiveTab(this.state.periods[0]);
  }
  onSetActiveTab = ({ title, remoteRequest }) => {
    if (this.state.activeTab.title !== title) {
      this.setState(
        {
          activeTab: { title, remoteRequest }
        },
        () => {
          this.props.onClick(remoteRequest);
        }
      );
    }
  };
  render() {
    const { Lang } = this.props;
    const { activeTab } = this.state;
    return (
      <View style={style.tabBox}>
        {this.state.periods.map((item, index) => {
          return (
            <TouchableOpacity
              key={item.title}
              style={{
                ...style.tabBtn,
                backgroundColor:
                  item.title === activeTab.title ? "#FD7044" : "rgba(0,0,0,0)"
              }}
              onPress={() => this.onSetActiveTab(item)}
            >
              <Text
                style={{
                  ...style.tabText,
                  color: item.title === activeTab.title ? "#fff" : "#727272"
                }}
              >
                {Lang.periods[item.title]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const style = StyleSheet.create({
  tabBox: {
    width: "85%",
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    elevation: 5,
    shadowOffset: { width: 1, height: 5 },
    shadowColor: "#ccc",
    shadowOpacity: 1.5,
    backgroundColor: "#fff"
  },
  tabBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "3%",
    borderRadius: 30
  },
  tabText: {
    color: "#727272",
    fontSize: 18
  }
});

export default PeriodType;
