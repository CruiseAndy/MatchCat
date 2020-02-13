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
  Image,
  TouchableOpacity
} from 'react-native';
import { connect } from "react-redux";
import { Actions } from 'react-native-router-flux';
import { ifIphoneX } from "react-native-iphone-x-helper";

/* Components */
import { Card, IconBlock } from '../../components/common';

/* Data */
import Language from '../../Language.json';
import { SERVICE_SKETCH } from '../../images';

class ServiceCenter extends Component {

	constructor(props) {
		super(props);
    this.Lang = Language[this.props.langCountry].serviceCenterPage;
	}

	componentWillReceiveProps(nextProps) {
    this.Lang = Language[nextProps.langCountry].serviceCenterPage;
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
          <Text style={ serviceStyle.headerTxt }>{this.Lang.title}</Text>
        </View>
        <View style={ serviceStyle.contactInfoView }>
          <View style={ serviceStyle.imgView }>
            <Image source={SERVICE_SKETCH} resizeMode="contain" style={{ width: "100%", height: 250, position: "absolute", bottom: 0 }} />
          </View>
          <Text style={{ ...serviceStyle.contactInfoTxt, color: "#02223F", fontSize: 22, marginBottom: 15 }}>{this.Lang.contactInfo1}</Text>
          <Text style={ serviceStyle.contactInfoTxt }>{this.Lang.contactInfo2}</Text>
          <Text style={{ ...serviceStyle.contactInfoTxt, marginBottom: 30 }}>{this.Lang.contactInfo3}</Text>
          <Text style={{ ...serviceStyle.contactInfoTxt, color: "#47474E", fontSize: 20, marginBottom: 5 }}>{this.Lang.contactInfo4}</Text>
          <View style={ serviceStyle.skypeInfo }>
            <Text style={{ ...serviceStyle.contactInfoTxt, color: "white" }}>it-support_554</Text>
          </View>
        </View>
      </Card>
		);
	}
}

/*
  Service Center 的 css樣式
*/
const serviceStyle = StyleSheet.create({
	container: {
		paddingLeft: 20,
		paddingRight: 20,
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
  },
  headerTxt: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: "#F78513",
  },
  contactInfoView: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingBottom: 20,
    marginTop: 150,
    elevation: 5,
    shadowColor: "#c6c6c6",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
      height: 5,
      width: 0
    },
    position: "relative",
  },
  contactInfoTxt: {
    fontWeight: "bold",
    color: "#707070",
    fontSize: 18,
    lineHeight: 30,
  },
  imgView: {
    width: "80%",
    height: 50,
  },
  skypeInfo: {
    width: "60%",
    height: 35,
    borderRadius: 35,
    backgroundColor: "#2C7AC3",
    alignItems: "center",
    justifyContent: "center",
  }
});

const mapStateToProps = ({ languageType }) => {
  const { langCountry } = languageType;

  return { langCountry };
};

export default connect(mapStateToProps, {})(ServiceCenter);