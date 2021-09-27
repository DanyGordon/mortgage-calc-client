export default {
  data() {
    return {
      page: Number(this.$route.query.page) || 1,
      pageSize: 7,
      pageCount: 0,
      allItems: [],
      items: []
    }
  },
  methods: {
    pageChangeHandler(page) {
      this.$router.push(`${this.$route.path}?page=${page}`);
      this.items = this.allItems[page - 1] || this.allItems[0];
    },
    setupPagination(allItems) {
      this.allItems = this.chunk(allItems, this.pageSize);
      this.pageCount = this.size(this.allItems);
      this.items = this.allItems[this.page - 1] || this.allItems[0];
    },
    chunk(array, size) {
      let count = 0;
      return array.reduce((acc, item, indx) => {
        if(indx === 0) {
          acc.push([item]);
          return acc;
        }
        if(indx === size || indx % size === 0) {
          count += 1;
          acc.push([item]);
          return acc; 
        } else {
          acc[count].push(item);
          return acc; 
        }
      }, []);
    },
    size(collection) {
      return Object.keys(collection).length;
    }
  }
}