//这个是选择时空页
import * as PIXI from "pixi.js";
import "pixi-spine"
import PixiSlider from "../lib/PixiSlider.js";
import RightDrawer from "../lib/RightDrawer.js";
import {
    createdSound,
    createdSprite,
    createdSpine,
    commonBg,
    takeoffSingleCloth,
    getSlotAndAttacetment,
    changeDress
} from "./Common";
import {
    TimelineMax
} from "gsap";
import {
    Garbage,
    SceneManager
} from "../lib/EasyPIXI";
import HomeGamePlay from "./Home1GamePlay.js"
import Home3Scene from "./Home3Scene.js"
export default class HomeTransform extends PIXI.Container {
    constructor() {
        super();
        this.Common = null;
        this.BackButtonNormal = null;
        this.BackButtonNormalEvent = null;
        this.BackButtonClick = null;
        this.BackButtonClickEvent = null;
        this.transformBg = null;
        this._Gb = { //滑块事件
            timeln: null,
            tween1: null,
            tween2: null
        };
        this.Scene = [
            "EgpytBg_jpg",
            "EuropeBg_jpg",
            "RepublicBg.jpg"
        ];
        this.Gender = null;
        this.SceneArr = [];
        this.SceneEventArr = [];
        this.GirlSpine = null;
        this.GirlSpineEvent = null;
        this.BoySpine = null;
        this.BoySpineEvent = null;
        this.AllSlotName = [];
        this.classicon = null;
        this.ClothDetail = {
            Gender: null,
            Cloth: null,
            SlotName: null,
            AttacetmentName: null,
            End: null
        };
        this.TimeGuild = null;
        //声音数据
        this.PlayGameBgMp3 = null;
        this.on("added", this.addedTransform, this);
    }
    addedTransform() {
        let self = this;
        (() => {
            this.SceneArr = [];
            this.SceneEventArr = [];
            this.Gender = null;
        })()
        //接受参数
        //测试状态
        //this.Gender = "girl";
        //this.Gender = "boy";
        //正式状态
        this.Gender = Garbage.getGarBage("Gender");
        this.classicon = Garbage.getGarBage("classicon");
        this.AllSlotName = Garbage.getGarBage("allSlotName");
        //背景声音
        this.PlayGameBgMp3 = createdSound({
            $alias: "PlayGameBg_mp3",
            $start: Garbage.getGarBage("SoundProgress"),
            $loop: true,
            $volume: 0.5
        });
        //背景图
        this.transformBg = createdSprite({
            $this: self,
            $alias: "transformBg_jpg"
        });
        //背景动画
        this.TimeSpine = createdSpine({
                $this: self,
                $x: 960,
                $y: 540,
                $alias: "Time_spine",
                $animation0Name: "animation"
            })
            //共同按钮
        this.Common = new commonBg({
            _this: self
        });
        //返回按钮事件
        this.BackButtonNormal = this.Common.BackButtonNormal;
        this.BackButtonNormal.on("pointerdown", self.BackButtonNormalEvent = () => {
            createdSound({
                $alias: "Button_mp3"
            }); //按钮声音音效
            self.BackButtonClick.visible = true;
            self.BackButtonNormal.visible = false;
        })
        this.BackButtonClick = this.Common.BackButtonClick;
        this.BackButtonClick.on("pointerup", self.BackButtonClickEvent = () => {
            self.BackButtonNormal.visible = true;
            self.BackButtonClick.visible = false;
            this.clearClass();
            SceneManager.run(new HomeGamePlay())
        });
        //动画事件
        this.GirlSpine = createdSpine({
            $this: self,
            $alias: "Girl_spine",
            $x: 950,
            $y: 500,
            $buttonMode: true,
            $visible: false,
            $animation0Name: "normal",
            $addChild: true
        });
        this.BoySpine = createdSpine({
            $this: self,
            $alias: "Boy_spine",
            $x: 950,
            $y: 700,
            $buttonMode: true,
            $visible: false,
            $animation0Name: "normal",
            $addChild: true
        });
        if (this.Gender == "girl") {
            this.GirlSpine.visible = true;
            this.BoySpine.visible = false;
            this.SelectSpine = null;
            this.SelectSpine = this.GirlSpine;
        } else {
            this.GirlSpine.visible = false;
            this.BoySpine.visible = true;
            this.SelectSpine = null;
            this.SelectSpine = this.BoySpine;
            this.getSlotAndAttacetment("Boy@hair@hair@europe_normal@normal_png"); //修改男孩的发型  
            this.changeDress();
        }
        //console.log(this.AllSlotName);
        //console.log("this.allslotNAME...")
        //换成以前的装备
        if (this.AllSlotName != undefined) {
            this.AllSlotName.forEach((item) => {
                if (item) {
                    this.getSlotAndAttacetment(item);
                    this.changeDress();
                }

            });
        }
        //滑块放入事件
        var mySwiper = new PixiSlider();
        mySwiper.slideColorAlpha = 0;
        mySwiper.slideWidth = 1850; //总的长度
        mySwiper.slideHeight = 300;
        mySwiper.swiperWidth = 1850;
        mySwiper.swiperHeight = 300;
        mySwiper.x = 100;
        mySwiper.y = 623;
        mySwiper.slides = 2;
        mySwiper.slideOffset = 200;
        //mySwiper.alpha = 0.5;
        mySwiper.smoothingMode = false;
        mySwiper.init();
        this.addChild(mySwiper);
        // "EgpytBg_jpg" "EuropeBg_jpg" "RepublicBg.jpg"
        //各个背景图片
        this.Scene.forEach((item, index) => {
            let itemEvent;
            let itemObj = createdSprite({
                $this: self,
                $alias: item,
                $scale: 0.3,
                $interactive: true,
                $buttonMode: true,
                // $visible: false,
                $addChild: false,

            });
            //console.log(itemObj.height)
            // itemObj.pivot.y = itemObj.height / 2;
            // itemObj.pivot.x = itemObj.width / 2;
            itemObj.on("pointertap", itemEvent = () => {
                itemObj.scale.set(0.4);
                this.Flag.forEach((item) => {
                    item.visible = false;
                })
                this.Flag[index].visible = true;
                createdSound({
                    $alias: "Button_mp3"
                }); //按钮声音音效
                //跳转
                this.TimeGuild = setTimeout(() => {
                    Garbage.clearGarBage("ScenePosition");
                    Garbage.setGarBage("ScenePosition", index);
                    this.clearClass();
                    SceneManager.run(new Home3Scene());
                }, 200);

            })
            self.SceneEventArr.push(itemEvent);
            self.SceneArr.push(itemObj);
        });
        //self.SceneArr[1].visible = true;
        //支持左右滑动效果
        this._Gb.timeln = new TimelineMax({
            onComplete: () => {
                //console.log("发生了timeIn事件...")
                mySwiper.updateAll();
                mySwiper.slideColorAlpha = 0;
                mySwiper.slideWidth = 500;
                mySwiper.slideHeight = 800;
                mySwiper.swiperWidth = 1800; //总长
                mySwiper.swiperHeight = 800;
                mySwiper.x = 100;
                mySwiper.y = 423;
                mySwiper.slides = 3;
                mySwiper.slideOffset = 200;
                mySwiper.smoothingMode = false;
                mySwiper.init();
                mySwiper.setCallBackPointerUp((data) => {
                    if (data.movedOffset < 0) {
                        if (mySwiper.realIndex < mySwiper.slides - 1) {
                            mySwiper.slideTo(mySwiper.realIndex + 1)
                        }
                    } else if (data.movedOffset >= 0) {
                        if (mySwiper.realIndex > 0) {
                            mySwiper.slideTo(mySwiper.realIndex - 1)
                        }
                    } else {
                        mySwiper.slideTo(mySwiper.realIndex)
                    }
                });
                self.Flag = [];
                self.SceneArr.forEach((item, index) => {
                    let Flag = null;
                    Flag = createdSprite({
                        $this: self,
                        $alias: "Flash_jpg",
                        $visible: false,
                        $scale: 1.5,
                        $visible: false,
                        $addChild: false
                    })
                    this.Flag.push(Flag);
                    Flag.x = -250;
                    Flag.y = 100;
                    mySwiper.slidesArr[index].addChild(Flag);
                    item.x = 200;
                    item.y = 400;
                    item.anchor.set(1 / 2, 1 / 2);
                    mySwiper.slidesArr[index].addChild(item);
                });
                //this.Flag[1].visible = true;
            }
        });
        //滑块事件结束

    }
    getSlotAndAttacetment = getSlotAndAttacetment
    changeDress = changeDress
    takeoffSingleCloth = takeoffSingleCloth
    clearClass() {
        let self = this;
        //声音数据
        PIXI.sound.pause("PlayGameBg_mp3"); //声音暂停...
        Garbage.clearGarBage("SoundProgress"); //清除声音数据
        Garbage.setGarBage("SoundProgress", this.PlayGameBgMp3._duration * this.PlayGameBgMp3.progress); //发送声音数据
        this.PlayGameBgMp3 = null;
        //定时器事件
        if (this.TimeGuild) {
            clearTimeout(this.TimeGuild);
        }
        //返回按钮事件
        this.BackButtonNormal.off("pointerdown", self.BackButtonNormalEvent);
        this.BackButtonClick.off("pointerup", self.BackButtonClickEvent);
        this.BackButtonClickEvent = null;
        this.BackButtonNormalEvent = null;
        this.BackButtonNormal = null;
        this.BackButtonClick = null;
        //移除背景图
        this.commonBg = null;
        this.transformBg = null;
        //移除场景的图
        this.SceneArr.forEach((item, index) => {
            item.off("pontertap", self.SceneEventArr[index])
            self.SceneEventArr[index] = null;
            item = null;
        })
        this.SceneArr = null;
        //全局类移除
        this.off("added", self.addedTransform);
        this.addedHomePageStage = null;
        this.parent.removeChildren();
    }
}