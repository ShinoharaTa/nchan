<script lang="ts">
export let title: {
	name?: string;
	imagePath?: string;
} = {};
export let prev = {
	name: "",
	func: () => {},
};
export let next = {
	name: "",
	func: () => {},
};
</script>

<div class="container bg-light sticky-top py-2">
    <section class="d-flex align-items-center">
        <div class="flex-shrink-0"><a href="javascript:void(0)" on:click={prev.func}>
            { prev.name }
        </a>
    </div>
        <div class="fs-2 flex-fill px-2 ellipsis">
          { title.name }
        </div>
        <div class="flex-shrink-0"><a href="javascript:void(0)" on:click={next.func}>
            { next.name }
        </a>
    </div>
    </section>
    <!-- <section>
        <slot />
    </section> -->
</div>
