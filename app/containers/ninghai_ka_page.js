import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Image,
    ListView,
    ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import {HOST} from '../common/config.js';

const aboutLogo = require('../img/logo.png');

export default class Ninghai_ka extends React.Component{


    static navigationOptions = {
        tabBarIcon: ({ tintColor }) =>
            <Icon name="md-home" size={25} color={tintColor} />
    };


    constructor(props) {
        super(props);
        this.state = {

            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),

            data: [],
            page:1,
            loading:false
        }

        this.get_data = this.get_data.bind(this);
        this.onEndReached = this.onEndReached.bind(this)
        this.renderFooter = this.renderFooter.bind(this);
        this.renderItem = this.renderItem.bind(this)




    }


    componentDidMount(){

        var thiz = this;


        this.get_data({

            page:1,
        })


    }


    get_data(para){

        var thiz = this;

        var body = {

            num:15,
            ...para,

        }


        var url = HOST+"news_list"

        fetch(url , {
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((json) => {


                    thiz.setState({

                        data:thiz.state.data.concat(json.result),
                        page:para.page,
                        loading:false
                    })
                }
            )
            .catch((error) => {
                    console.error(error);
                }
            );
    }

    onEndReached() {

        this.setState({

            loading:true
        })

        this.get_data({

            page:this.state.page+1,
        })

    }
    renderFooter() {

            if (!this.state.loading){

                return;
            }

            return (
                <View style={style.footerContainer}>
                    <ActivityIndicator size="small" color="#3e9ce9" />
                    <Text style={style.footerText}>数据加载中……</Text>
                </View>
            );

        return <View />;
    }

    renderItem = (data,sessionId,rowId)=>{

        if (!data.title)
            return null

        return <View style={style.view_div}>

                    <Image style={style.img} source={aboutLogo}/>

                    <View style={style.view_div_right}>

                    <Text style={style.title}   numberOfLines={8}>{data.title}你在干什么</Text>
                        <Text>{data.new_time}</Text>
                    </View>
            </View>
    }

    render() {
        return (

            <View style={style.container}>

                <ListView
                    initialListSize={1}
                    dataSource={this.state.dataSource.cloneWithRows(this.state.data)}
                    renderRow={this.renderItem}
                    style={style.listView}
                    onEndReachedThreshold={10}
                    renderFooter={this.renderFooter}
                    enableEmptySections = {true}
                    onEndReached={() => this.onEndReached()}
                />


            </View>
        );
    }
}

const style = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:'#fff'
    },
    listView: {
        backgroundColor: '#fff',
        height:50
    },

    view_div:{

        justifyContent: 'flex-start',
        alignItems:"center",
        flexDirection:"row",
        height:100,
        paddingLeft:10,
        borderBottomWidth: 1  ,
        borderBottomColor: '#cccccc',

    },

    img:{

        width:60,
        height:60,
        marginRight:20
    },

    title:{

        fontSize:20,
        marginBottom:10,

    },
    view_div_right:{

        flexDirection:"column",
        paddingRight:10
    },
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        marginTop:10
    },
    footerText: {
        textAlign: 'center',
        fontSize: 16,
        marginLeft: 10
    },
});

