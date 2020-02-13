import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from "react-native";

class PeriodScrollList extends Component {
  constructor(props) {
    super(props);
  }
  onClickHandler = ({ period_before, periodType }) => {
    this.props.onPeriodClick({ key: periodType, value: period_before });
  };
  onRenderSellScrollItem = () => {
    const { summary, Lang, periodType, periodBefore } = this.props;
    const arr_items = [];
    for (let i = 0; i < summary.length; i++) {
      if (periodType === "week") {
        arr_items.push(
          <TouchableOpacity
            key={i}
            style={style.scrollItem}
            onPress={event =>
              this.onClickHandler(
                {
                  ...summary[i],
                  periodType
                },
                event
              )
            }
          >
            <View
              style={{
                ...style.timeRange,
                backgroundColor:
                  summary[i].period_before === periodBefore
                    ? "#FD7044"
                    : "#C8C8C9"
              }}
            >
              <Text style={style.timeText}>{summary[i].week_begin}</Text>
              <Text style={style.timeText}>|</Text>
              <Text style={style.timeText}>{summary[i].week_end}</Text>
            </View>
            <View style={style.recordInfo}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    ...style.recordText,
                    color:
                      summary[i].period_before === periodBefore
                        ? "#FD7044"
                        : "#C8C8C9",
                    fontSize: 12
                  }}
                >
                  {summary[i].sell_order_count}
                </Text>
                <Text
                  style={{
                    ...style.recordText,
                    color:
                      summary[i].period_before === periodBefore
                        ? "#000"
                        : "#C8C8C9",
                    fontSize: 12
                  }}
                >
                  {Lang.sell.record.sell_order_count}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    ...style.recordText,
                    color:
                      summary[i].period_before === periodBefore
                        ? "#FD7044"
                        : "#C8C8C9",
                    fontSize: 12
                  }}
                >
                  {`${Math.round(summary[i].sell_order_success_rate * 10000) /
                    100}%`}
                </Text>
                <Text
                  style={{
                    ...style.recordText,
                    color:
                      summary[i].period_before === periodBefore
                        ? "#000"
                        : "#C8C8C9",
                    fontSize: 12
                  }}
                >
                  {Lang.sell.record.sell_order_success_rate}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }
      if (periodType === "month") {
        arr_items.push(
          <TouchableOpacity
            key={i}
            style={style.scrollItem}
            onPress={() => {
              this.onClickHandler({
                ...summary[i],
                periodType
              });
            }}
          >
            <View
              style={{
                ...style.timeRange,
                ...style.timeMonth,
                backgroundColor:
                  summary[i].period_before === periodBefore
                    ? "#FD7044"
                    : "#C8C8C9"
              }}
            >
              <Text
                style={{ ...style.timeText, fontSize: 30, fontWeight: "bold" }}
              >
                {summary[i].month}
              </Text>
              <Text
                style={{ ...style.timeText, fontSize: 25, fontWeight: "bold" }}
              >
                {Lang.periods.month}
              </Text>
            </View>
            <View style={style.recordInfo}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    ...style.recordText,
                    color:
                      summary[i].period_before === periodBefore
                        ? "#FD7044"
                        : "#C8C8C9"
                  }}
                >
                  {summary[i].sell_order_count}
                </Text>
                <Text
                  style={{
                    ...style.recordText,
                    color:
                      summary[i].period_before === periodBefore
                        ? "#000"
                        : "#C8C8C9"
                  }}
                >
                  {Lang.sell.record.sell_order_count}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    ...style.recordText,
                    color:
                      summary[i].period_before === periodBefore
                        ? "#FD7044"
                        : "#C8C8C9"
                  }}
                >
                  {`${Math.round(summary[i].sell_order_success_rate * 10000) /
                    100}%`}
                </Text>
                <Text
                  style={{
                    ...style.recordText,
                    color:
                      summary[i].period_before === periodBefore
                        ? "#000"
                        : "#C8C8C9"
                  }}
                >
                  {Lang.sell.record.sell_order_success_rate}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }
    }
    return arr_items;
  };
  onRenderBuyScrollItem = () => {
    const { summary, Lang, periodType, periodBefore } = this.props;
    const arr_items = [];
    for (let i = 0; i < summary.length; i++) {
      if (periodType === "week") {
        arr_items.push(
          <TouchableOpacity
            key={i}
            style={style.scrollItem}
            onPress={() => this.onClickHandler({ ...summary[i], periodType })}
          >
            <View
              style={{
                ...style.timeRange,
                backgroundColor:
                  summary[i].period_before === periodBefore
                    ? "#FD7044"
                    : "#C8C8C9"
              }}
            >
              <Text style={style.timeText}>{summary[i].week_begin}</Text>
              <Text style={style.timeText}>|</Text>
              <Text style={style.timeText}>{summary[i].week_end}</Text>
            </View>
            <View style={style.recordInfo}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    ...style.recordText,
                    color:
                      summary[i].period_before === periodBefore
                        ? "#FD7044"
                        : "#C8C8C9"
                  }}
                >
                  {summary[i].total_bonus}
                </Text>
                <Text
                  style={{
                    ...style.recordText,
                    color:
                      summary[i].period_before === periodBefore
                        ? "#000"
                        : "#C8C8C9"
                  }}
                >
                  {Lang.buy.record.total_bonus}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }
      if (periodType === "month") {
        arr_items.push(
          <TouchableOpacity
            key={i}
            style={style.scrollItem}
            onPress={() => this.onClickHandler({ ...summary[i], periodType })}
          >
            <View
              style={{
                ...style.timeRange,
                ...style.timeMonth,
                backgroundColor:
                  summary[i].period_before === periodBefore
                    ? "#FD7044"
                    : "#C8C8C9"
              }}
            >
              <Text
                style={{ ...style.timeText, fontSize: 30, fontWeight: "bold" }}
              >
                {summary[i].month}
              </Text>
              <Text
                style={{ ...style.timeText, fontSize: 25, fontWeight: "bold" }}
              >
                {Lang.periods.month}
              </Text>
            </View>
            <View style={style.recordInfo}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    ...style.recordText,
                    color:
                      summary[i].period_before === periodBefore
                        ? "#FD7044"
                        : "#C8C8C9"
                  }}
                >
                  {summary[i].total_bonus}
                </Text>
                <Text
                  style={{
                    ...style.recordText,
                    color:
                      summary[i].period_before === periodBefore
                        ? "#000"
                        : "#C8C8C9"
                  }}
                >
                  {Lang.buy.record.total_bonus}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }
    }
    return arr_items;
  };
  onCheckOrderType = () => {
    const { orderType } = this.props;
    if (orderType === "buy") return this.onRenderBuyScrollItem();
    return this.onRenderSellScrollItem();
  };
  render() {
    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {this.onCheckOrderType()}
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  scrollItem: {
    margin: 10,
    width: 106,
    height: 130,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 5,
    shadowOffset: { width: 0, height: 5 },
    shadowColor: "#c6c6c6",
    shadowOpacity: 0.75,
    shadowRadius: 5
  },
  timeRange: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  timeMonth: {
    flexDirection: "row",
    backgroundColor: "#f00"
  },
  timeText: {
    color: "#fff",
    fontWeight: "bold"
  },
  recordInfo: {
    flex: 1,
    flexDirection: "row",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  recordText: {
    color: "#C8C8C9"
  }
});
export default PeriodScrollList;
