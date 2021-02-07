<template>
  <div class="noFoundPage">
    <img class="noFoundPage__img" :src="images.noFound" />
    <div class="noFoundPage__title">页面可能已被删除或您没有查看该内容的权限</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: {
        noFound: require("@/assets/images/404.png")
      }
    };
  }
};
</script>

<style lang="less" scoped>
.noFoundPage {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &__img {
    width: 400px;
    margin-right: 24px;
  }
  &__title {
    font-weight: 700;
    font-size: 16px;
  }
}
</style>
