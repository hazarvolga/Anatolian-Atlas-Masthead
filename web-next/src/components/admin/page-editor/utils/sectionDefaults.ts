"use client";


export const getDefaultContent = (type: string) => {
  switch (type) {
    case "hero":
      return {
        title: "Welcome to Our Website",
        subtitle: "Discover amazing experiences with us",
        backgroundImage: "",
        ctaText: "Get Started",
        ctaLink: "#"
      };
    case "content":
      return {
        title: "Section Title",
        content: "<p>Add your content here...</p>"
      };
    case "cards":
      return {
        title: "Our Services",
        cards: [
          {
            title: "Service 1",
            description: "Description for service 1",
            image: "",
            link: "#"
          }
        ]
      };
    case "image":
      return {
        image: "",
        caption: "",
        altText: ""
      };
    case "custom":
      return {
        html: "<div><p>Custom HTML content</p></div>"
      };
    default:
      return {};
  }
};
