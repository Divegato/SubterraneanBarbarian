using System.Web.Mvc;
using Gamegato.GoldRush.Web.Controllers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Gamegato.GoldRush.Web.Tests.Controllers
{
    [TestClass]
    public class HomeControllerTests
    {
        [TestMethod]
        public void IndexTest()
        {
            // Arrange
            HomeController controller = new HomeController();

            // Act
            var result = controller.Index();

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(ViewResult));
        }
    }
}
