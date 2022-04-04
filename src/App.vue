<template>
  <BaseHeader />
  <div style="display: flex">
    <BaseSide />
    <div>
      <img alt="Vue logo" class="element-plus-logo" src="./assets/logo.png" />
      <LoginView msg="Welcome to GCAS" />
    </div>
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  text-align: center;
  color: var(--el-text-color-primary);
}

.element-plus-logo {
  width: 50%;
}
</style>
