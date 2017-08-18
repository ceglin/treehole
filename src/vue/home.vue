<template>
	<div class='home'>
		<div class = 'paper-conta'>
			<mu-paper v-for="item in treeholes" class="demo-paper" :zDepth="1" >
				<p>{{item.content}}</p>
				<div class="opea">
					<div class="opea-content-left">{{item.date}}</div>
					<div class="opea-content-right">
						<mu-avatar icon="favorite" color="orange200" backgroundColor="pink400" :size="22" :iconSize="14"/>
						<span class="icon-title">赞 {{item.support}}</span>
						<mu-avatar icon="folder" color="orange200" backgroundColor="pink400" :size="22" :iconSize="14"/>
						<span class="icon-title">评论</span>
					</div>
				</div>
			</mu-paper>
		</div>
		<mu-float-button icon="add" class="demo-float-button" to="/new"/>
	</div>
</template>

<script>
	export default {
		data (){
			return {
				treeholes: []
			}
		},
		mounted (){
			this.$http.get('./treehole/getAccount').then(function(res){
				let resArr = [];
				res.body.forEach( function(element, index) {
					let tdate = new Date(element.date),
					date = tdate.getFullYear() + '-' + (tdate.getMonth()+1) + '-' + tdate.getDate() + ' ' + (tdate.getHours()+1) + ':' + tdate.getMinutes();
					resArr[index] = {
						content: element.content,
						date: date,
						comment: element.comment,
						support: element.support
					};
				});
				this.treeholes = resArr.reverse();
			},function(res){
				//失败
				console.log(res);
			});
		},
		methods: {
		},
		components: {
		}
	}
</script>

<style>
	.home{
		background: url('http://localhost:8080/img/bg.png') no-repeat center;
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
		cursor: pointer;
		display: flex;
	    justify-content: space-between;
	    align-items: flex-end;
	}
	.opea .opea-content-left{
		font-size: 12px;
	}
	.opea .opea-content-right{
		background-color: #fff;
	    border-radius: 3px;
	    padding: 5px;
	}
</style>