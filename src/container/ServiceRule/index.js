/*
 * Date : 2019/04/17
 * Writer : kevin
 */

/* Tools */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { connect } from "react-redux";
import { Actions } from 'react-native-router-flux';
import { ifIphoneX } from "react-native-iphone-x-helper";

/* Components */
import { Card, IconBlock } from '../../components/common';

/* Data */
import Language from '../../Language.json';

class ServiceRule extends Component {

	constructor(props) {
		super(props);
    this.Lang = Language[this.props.langCountry].serviceRulePage;
	}

	componentWillReceiveProps(nextProps) {
    this.Lang = Language[nextProps.langCountry].serviceRulePage;
  }

	render() {
		return (
			<Card style={ serviceStyle.container }>
        <View style={ serviceStyle.header }>
          <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 10 }} onPress={ () => Actions.pop() }>
            <IconBlock
              name="chevron-left"
              color={"#C8C8C8"}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={{ marginTop: 40, paddingLeft: 20, paddingRight: 20 }}>
          <Text style={{ textAlign: "center", color: "#F7820D", fontSize: 26, fontWeight: "bold", marginBottom: 20 }}>{this.Lang.title}</Text>
        {
          this.Lang.data.map((item, index) => {
            const { title, content } = item;
            return (
              <View key={index} style={{ marginBottom: 30 }}>
                <Text style={{ color: "#F7820D", fontWeight: "bold", fontSize: 22, marginBottom:5 }}>{title}</Text>
                <Text style={{ fontSize: 16, lineHeight: 20 }}>{content}</Text>
                {
                  item.itemList && item.itemList.map((text, index) => {
                    return <Text key={index} style={{ fontSize: 16, lineHeight: 20, marginTop: 5 }}>{`${index + 1}. ${text}`}</Text>
                  })
                }
                {
                  item.notice
                  ? <Text key={index} style={{ fontSize: 16, lineHeight: 20, marginTop: 5  }}>{item.notice}</Text>
                  : null
                }
              </View>
            );
          })
        }
        </ScrollView>
      </Card>
		);
	}
}

/*
  Service Center 的 css樣式
*/
const serviceStyle = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
    backgroundColor: "#F0F0F0",
    position: "relative",
  },
  header: {
    width: "100%",
    height: 30,
    position: "absolute",
		...ifIphoneX({
			top: 40,
		}, {
			top: 30,
		}),
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },
});

const mapStateToProps = ({ languageType }) => {
  const { langCountry } = languageType;

  return { langCountry };
};

export default connect(mapStateToProps, {})(ServiceRule);