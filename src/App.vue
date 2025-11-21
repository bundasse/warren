<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="wrapper">
    <div id="mainContainer">
      <header>
          <h1><RouterLink to="/">Warren</RouterLink></h1>
          <nav>
              <ul class="navContainer">
                <li><RouterLink to="/profile">Dasse</RouterLink></li>
                <li><RouterLink to="/pic">Pic</RouterLink></li>
                <li><RouterLink to="/review">Review </RouterLink></li>
                <li><RouterLink to="/link">Link</RouterLink></li>
              </ul>
          </nav>
      </header>
      <main>
        <RouterView />
      </main>
      <footer>
        <ul class="linkContainer">
          <li><a href="https://x.com/couque_dasse" target="_blank" aria-label="트위터(X)"><i class='bx bx-bird-alt bx-sm'></i></a></li>
          <li><a href="https://buttersc.one/@couque_dasse" target="_blank" aria-label="연합우주(버터스콘)"><i class='bx bx-planet bx-sm'></i> </a></li>
        </ul>
      </footer>
    </div>
  </div>
</template>
