<template>
	<div class='home'>
		<div class = 'paper-conta'>
			<mu-paper v-for="item in items" class="demo-paper" :zDepth="1" >
				<p>{{item.message}}</p>
				<div class="opea">
					<div class="opea-content">
						<mu-avatar icon="favorite" color="orange200" backgroundColor="pink400" :size="22" :iconSize="14"/>
						<span class="icon-title">赞</span>
						<mu-avatar icon="folder" color="orange200" backgroundColor="pink400" :size="22" :iconSize="14"/>
						<span class="icon-title">评论</span>
					</div>
				</div>
			</mu-paper>
		</div>
		<mu-float-button icon="add" class="demo-float-button"/>
	</div>
</template>

<script>
	export default {
		data (){
			return {
				items: [
					{message: '这首歌，总让我想象出一个画面。两人在熙熙攘攘的人群中偶遇，又被人潮给错开，其中一个人兴奋地想把手抬起来又尴尬地假装是在摸摸后脑勺，另一个人微微笑着明白了，就转身走进了人群中。想着也不知何时才能够再见到。'},
					{message: '这是黄伟文写给杨千桦的歌，黄伟文说:我知道杨小姐不成喜欢过我写给她的歌。杨只认林夕，黄，杨两人关系恶化。黄伟文写了这首歌给杨最好的朋友唱，一天杨在车上电台听到这首歌后停车在路边痛快。朋友。'},
					{message: '劝君更尽一杯酒，西出阳关无故人'},
					{message: '老友 愿你无忧。这首歌的每字每句都让我想起你，没那么多共同话题了，我也不是躲着你，记着你走进过我世界，自习偷偷跑掉玩儿一节课，坐在教学楼后面聊天听歌，你陪我走到家门口。无论什么时候你想找人谈谈心 我都会在这儿，即使从前那么要好已经回不去了'}
				]
			}
		},
		methods: {

		},
		components: {
		}
	}
</script>

<style>
	.home{
		background: url('https://b-ssl.duitang.com/uploads/item/201510/14/20151014144907_dLXUa.png') no-repeat center;
		background-size: cover;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
	}
	.paper-conta{
	    position: relative;
	    top: 64px;
	    height: 82%;
	    overflow: scroll;
	}
	.demo-paper{
		margin: 8px;
	    border-radius: 10px;
	    opacity: 0.8;
	    padding: 14px;
	    font-size: 15px;
	    background-color: #e0f2f1;
	}
	.opea{
		text-align: right;
		cursor: pointer;
	}
	.opea .opea-content{
		background-color: #fff;
	    border-radius: 3px;
	    width: 130px;
	    padding: 5px;
	    display: inline-block;
	}
	.opea .icon-title{
		padding-right: 10px;
		margin-right: 5px;
	}
	.opea .icon-title:first-child{
	    border-right: 2px solid #b2dfdb;
	}
</style>