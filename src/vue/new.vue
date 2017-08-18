<template>
	<div class='new'>
		<mu-paper class="new-wrap demo-paper" :zDepth="2">
			<textarea class="input" placeholder="发条树洞散散心~" autofocus v-model="content"></textarea>
			<mu-raised-button label="传送" class="demo-raised-button submit" primary v-on:click='setTreehole' />
		</mu-paper>
	</div>
</template>

<script>
	export default {
		data (){
			return {
				content: ''
			}
		},
		methods: {
			setTreehole(){
				if(!this.content){
					alert('发条空的是怎么个意思~')
					return false;
				}
				this.$http.post('./treehole/createAccount',{content: this.content}).then(function(res){
					//成功
					alert('嗯，树又多了一个洞~');
				},function(res){
					//失败
					console.log(res);
				})
			}
		}
	}
</script>

<style>
	.new-wrap{
	    height: 90%;
	    overflow: scroll;
	}
	.input{
		width: 100%;
		min-height: 350px;
		resize: none;
		border-radius: 5px;
	}
	.submit{
		float: right;
	}
</style>