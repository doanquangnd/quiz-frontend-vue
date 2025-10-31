<script>
export default {
  name: 'PageTitle',
  props: { title: String },
  mounted() {
    if (this.$props?.title) document.title = this.$props.title
  },
  render() {
    return null
  },
}
</script>

